
﻿
# VCon Datasets
**Vcon-datasets** enables companies to create customized datasets from their unique interactions with users. This solution empowers organizations to derive insights directly from their conversations, enhancing their understanding of customer behavior and needs.  
  
In contrast to relying on publicly available data, which often leads AI models to learn about other businesses, **Vcon-datasets** allows companies to harness their own data for training. By collecting and curating user interaction data, organizations can develop AI models that are more relevant and effective, ultimately improving customer service and strategic decision-making.  
  
With **Vcon-datasets**, businesses can foster a data-driven culture and gain a competitive edge by leveraging insights specific to their operations.

[https://drive.google.com/file/d/19p8vHNNk38EywLmGIi9XbxST-AuBNp3I/view?usp=sharing](https://drive.google.com/file/d/19p8vHNNk38EywLmGIi9XbxST-AuBNp3I/view?usp=sharing)  

[https://youtu.be/eRRvHC9kayU](https://youtu.be/eRRvHC9kayU)  
  

## Tools used
1. VCons
2. React JS
3. FastAPI

## How to run Project
You can run the project in two ways:

Firstly by running the `api/file_watcher.py` file and adding your VCons to `api/uploads/` while the script is running, which will automatically parsed each added file.

or by running the app (frontend and backend)
   
    # Frontend
    npm install
    npm run dev
    
    # Backend
    cd api/
    python -m venv venv
    pip install -r requirements.txt
    fastapi dev main.py
    
