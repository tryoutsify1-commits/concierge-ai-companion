import os
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

def run_hotel_agent(guest_request: str):
    """
    Connects securely to your Azure AI Foundry Project using 
    your exact target URI and deployed model configuration.
    """
    # Authenticates using your precise Azure resource URL
    project_client = AIProjectClient(
        endpoint=os.environ.get("AZURE_AI_PROJECT_ENDPOINT", "https://seifahmeddev-5684-resource.cognitiveservices.azure.com/"),
        credential=DefaultAzureCredential()
    )
    
    # Leverages your exact deployed gpt-4.1 model asset
    agent = project_client.agents.create_agent(
        model=os.environ.get("MODEL_DEPLOYMENT_NAME", "gpt-4.1"),
        name="hotel-concierge-agent",
        instructions="You are Aurelia, an autonomous luxury hotel concierge. Fulfill guest needs gracefully."
    )
    
    thread = project_client.agents.create_thread()
    project_client.agents.create_message(thread_id=thread.id, role="user", content=guest_request)
    run = project_client.agents.create_and_process_run(thread_id=thread.id, agent_id=agent.id)
    
    if run.status == "completed":
        messages = project_client.agents.list_messages(thread_id=thread.id)
        return messages.data[0].content[0].text.value
