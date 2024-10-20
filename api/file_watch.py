import time
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from agent import parse_vcon


class NewFileHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return None

        # Check if the new file is a JSON file
        if event.src_path.endswith(".json"):
            retries = 5  # Number of retries
            delay = 1  # Delay between retries in seconds
            for attempt in range(retries):
                try:
                    # Open and read the JSON file contents
                    with open(event.src_path, "r") as json_file:
                        file_contents = json.load(json_file)
                        file_contents_str = json.dumps(
                            file_contents
                        )  # Convert to string

                        # Parse the VCon to dataset file
                        parse_vcon(file_contents_str)
                        print(f"New JSON file added: {event.src_path}")
                    break  # If reading succeeds, break out of the loop
                except (PermissionError, IOError) as e:
                    print(
                        f"Attempt {attempt + 1}/{retries}: Error reading the file {event.src_path}: {e}"
                    )
                    time.sleep(delay)  # Wait before retrying
            else:
                print(
                    f"Failed to read the file {event.src_path} after {retries} attempts."
                )
        else:
            print(f"Ignoring non-JSON file: {event.src_path}")


if __name__ == "__main__":
    path = "uploads"
    event_handler = NewFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)

    print(f"Watching directory: {path}")
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\nStopped watching.")
    observer.join()
