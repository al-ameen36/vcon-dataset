from pydantic import BaseModel


class MessageResponse(BaseModel):
    message: str
    sentiment: str


class ConversationPair(BaseModel):
    agent: MessageResponse
    customer: MessageResponse
    recommendation: MessageResponse
    score: float


class ConversationDataset(BaseModel):
    source: str
    uuid: str
    created_at: str
    description: str
    conversation: list[ConversationPair]
