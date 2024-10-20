import json
from openai import OpenAI
from dotenv import load_dotenv
from schemas import ConversationDataset

load_dotenv()
client = OpenAI()


def write_dataset_to_file(conversation_data: ConversationDataset, file_name: str):
    # Use the uuid from the vcon data to set the file name
    output_file = f"datasets/{file_name}"

    # Convert the conversation data to JSON and save to file
    with open(output_file, "w") as file:
        json.dump(conversation_data.model_dump(), file, indent=4)

    print(f"Conversation data saved to {output_file}")


def parse_vcon(vcon_str: str, file_name: str):
    print("Parsing VCon...")
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
                "role": "system",
                "content": """You are an AI specialized in extracting and analyzing customer-agent conversations. Your task is to:
    1. Extract every conversation pair between the customer and the agent.
    2. Analyze the sentiment for each message from both the agent and the customer, providing sentiments such as 'positive', 'neutral', or 'negative' for each.
    3. Provide a recommended response for the agent, including a better response message and an improved sentiment.
    4. Include a score reflecting the quality of the conversation and a short description summarizing the conversation.

    For each conversation, structure the output with the following fields:
    - agent: { 'message': '...', 'sentiment': '...' }
    - customer: { 'message': '...', 'sentiment': '...' }
    - recommendation: { 'message': '...', 'sentiment': '...' }
    - score: A float representing the quality of the interaction.
    - description: A summary of the conversation.

    The extracted data should be returned in the structure of `ConversationDataset`, where each `ConversationPair` includes an agent-customer interaction with a recommended agent response and a score.
    """,
            },
            {"role": "user", "content": vcon_str},
        ],
        response_format=ConversationDataset,
    )

    conversation_data = completion.choices[0].message.parsed
    write_dataset_to_file(conversation_data, file_name)
    return conversation_data
