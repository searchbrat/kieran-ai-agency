// Simple AI chatbot for demo booking and lead qualification
class NexusAIChatbot {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatButton = document.getElementById('chat-send');
        this.chatToggle = document.getElementById('chat-toggle');
        this.closeChat = document.getElementById('close-chat');
        
        this.currentStep = 'greeting';
        this.userData = {
            name: '',
            email: '',
            company: '',
            interest: '',
            currentSolution: ''
        };
        
        this.initEventListeners();
        this.initChat();
    }
    
    initEventListeners() {
        // Toggle chat widget
        this.chatToggle.addEventListener('click', () => {
            this.chatContainer.classList.toggle('chat-open');
            if (this.chatContainer.classList.contains('chat-open')) {
                this.chatInput.focus();
            }
        });
        
        // Close chat widget
        this.closeChat.addEventListener('click', () => {
            this.chatContainer.classList.remove('chat-open');
        });
        
        // Send message on button click
        this.chatButton.addEventListener('click', () => {
            this.handleUserInput();
        });
        
        // Send message on Enter key
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserInput();
            }
        });
    }
    
    initChat() {
        // Add initial bot greeting with slight delay to simulate loading
        setTimeout(() => {
            this.addBotMessage("Hi there! 👋 I'm NexusAI's virtual assistant. How can I help you today?");
            this.addBotMessage("Would you like to learn more about our services, schedule a demo, or get a custom quote?", [
                "Learn about services",
                "Schedule a demo",
                "Get a quote"
            ]);
        }, 500);
    }
    
    handleUserInput() {
        const userInput = this.chatInput.value.trim();
        if (userInput === '') return;
        
        // Add user message to chat
        this.addUserMessage(userInput);
        this.chatInput.value = '';
        
        // Process user input based on current conversation step
        setTimeout(() => {
            this.processUserInput(userInput);
        }, 500);
    }
    
    processUserInput(input) {
        const lowerInput = input.toLowerCase();
        
        switch (this.currentStep) {
            case 'greeting':
                if (lowerInput.includes('service') || lowerInput.includes('learn')) {
                    this.showServices();
                } else if (lowerInput.includes('demo') || lowerInput.includes('schedule')) {
                    this.startDemoScheduling();
                } else if (lowerInput.includes('quote') || lowerInput.includes('pricing')) {
                    this.startQuoteProcess();
                } else {
                    this.handleGeneralQuery(lowerInput);
                }
                break;
                
            case 'demo_name':
                this.userData.name = input;
                this.currentStep = 'demo_email';
                this.addBotMessage(`Nice to meet you, ${input}! Could you please share your email address so we can send you demo details?`);
                break;
                
            case 'demo_email':
                if (this.validateEmail(input)) {
                    this.userData.email = input;
                    this.currentStep = 'demo_company';
                    this.addBotMessage("Great! And what company are you with?");
                } else {
                    this.addBotMessage("That doesn't look like a valid email address. Could you please check and try again?");
                }
                break;
                
            case 'demo_company':
                this.userData.company = input;
                this.currentStep = 'demo_interest';
                this.addBotMessage("Thanks! Which of our services are you most interested in learning about?", [
                    "Intelligent CRM",
                    "AI Content Creation",
                    "Smart Analytics",
                    "Lead Scoring",
                    "All Services"
                ]);
                break;
                
            case 'demo_interest':
                this.userData.interest = input;
                this.currentStep = 'demo_current';
                this.addBotMessage("Excellent choice! Are you currently using any similar marketing tools? If so, which ones?");
                break;
                
            case 'demo_current':
                this.userData.currentSolution = input;
                this.currentStep = 'demo_schedule';
                this.addBotMessage("Thank you for sharing that information. When would be a good time for a demo? We have availability this week on Wednesday and Thursday.", [
                    "Wednesday, 10:00 AM",
                    "Wednesday, 2:00 PM",
                    "Thursday, 11:00 AM",
                    "Thursday, 3:00 PM"
                ]);
                break;
                
            case 'demo_schedule':
                this.currentStep = 'demo_complete';
                this.addBotMessage(`Perfect! I've scheduled your demo for ${input}. We'll send a calendar invite to ${this.userData.email} shortly.`);
                this.addBotMessage("Is there anything else you'd like to know before your demo?");
                
                // Here in a real implementation, you would send this data to your backend
                console.log("Demo scheduled with data:", this.userData, "Time:", input);
                break;
                
            case 'quote_company_size':
                this.userData.companySize = input;
                this.currentStep = 'quote_needs';
                this.addBotMessage("Thanks! Which of our services are you most interested in?", [
                    "Intelligent CRM",
                    "AI Content Creation",
                    "Smart Analytics",
                    "Lead Scoring",
                    "Complete AI Suite"
                ]);
                break;
                
            case 'quote_needs':
                this.userData.interest = input;
                this.currentStep = 'quote_contact';
                this.addBotMessage("Based on your requirements, I'd recommend our Growth plan, which starts at $999/month. Would you like a personalized quote with custom pricing?", [
                    "Yes, send me a quote",
                    "No, just more info for now"
                ]);
                break;
                
            case 'quote_contact':
                if (lowerInput.includes('yes')) {
                    this.currentStep = 'quote_email';
                    this.addBotMessage("Great! Could you please provide your email address so we can send you a detailed quote?");
                } else {
                    this.currentStep = 'greeting';
                    this.addBotMessage("No problem! Let me know if you have any other questions. Would you like to explore another topic?", [
                        "Learn about services",
                        "Schedule a demo",
                        "Talk to a human"
                    ]);
                }
                break;
                
            case 'quote_email':
                if (this.validateEmail(input)) {
                    this.userData.email = input;
                    this.currentStep = 'quote_complete';
                    this.addBotMessage(`Thanks! We'll prepare a custom quote and send it to ${input} within the next 24 hours.`);
                    this.addBotMessage("Is there anything specific you'd like us to address in the quote?");
                    
                    // Here in a real implementation, you would send this data to your backend
                    console.log("Quote requested with data:", this.userData);
                } else {
                    this.addBotMessage("That doesn't look like a valid email address. Could you please check and try again?");
                }
                break;
                
            default:
                this.handleGeneralQuery(lowerInput);
        }
    }
    
    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message user-message';
        messageElement.textContent = message;
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    addBotMessage(message, options = null) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message bot-message';
        messageElement.textContent = message;
        this.chatMessages.appendChild(messageElement);
        
        // Add clickable options if provided
        if (options && options.length > 0) {
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'chat-options';
            
            options.forEach(option => {
                const optionButton = document.createElement('button');
                optionButton.className = 'chat-option';
                optionButton.textContent = option;
                optionButton.addEventListener('click', () => {
                    this.addUserMessage(option);
                    this.processUserInput(option);
                    optionsContainer.remove();
                });
                optionsContainer.appendChild(optionButton);
            });
            
            this.chatMessages.appendChild(optionsContainer);
        }
        
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showServices() {
        this.currentStep = 'showing_services';
        this.addBotMessage("Here are our main AI-powered marketing services:");
        this.addBotMessage("1️⃣ Intelligent CRM: AI-driven customer relationship management that segments contacts, predicts behavior, and personalizes interactions.");
        this.addBotMessage("2️⃣ AI Content Creation: Generate blogs, social media, and email campaigns tailored to your brand voice.");
        this.addBotMessage("3️⃣ Smart Analytics: Predictive analytics that identify trends and optimization opportunities.");
        this.addBotMessage("4️⃣ Lead Scoring: AI that identifies your most promising leads and predicts conversion likelihood.");
        this.addBotMessage("5️⃣ Conversational Marketing: 24/7 intelligent chatbots for visitor engagement and lead qualification.");
        
        setTimeout(() => {
            this.addBotMessage("Would you like to schedule a demo to see these in action, or do you have questions about a specific service?", [
                "Schedule a demo",
                "Ask about Intelligent CRM",
                "Ask about AI Content Creation",
                "Ask about Smart Analytics",
                "Ask about Lead Scoring"
            ]);
        }, 1000);
    }
    
    startDemoScheduling() {
        this.currentStep = 'demo_name';
        this.addBotMessage("I'd be happy to help you schedule a personalized demo! First, could you tell me your name?");
    }
    
    startQuoteProcess() {
        this.currentStep = 'quote_company_size';
        this.addBotMessage("I'd be happy to help you get a custom quote. First, could you tell me about the size of your company?", [
            "1-10 employees",
            "11-50 employees",
            "51-200 employees",
            "201-500 employees",
            "500+ employees"
        ]);
    }
    
    handleGeneralQuery(query) {
        // Simple keyword matching for common questions
        if (query.includes('pricing') || query.includes('cost') || query.includes('price')) {
            this.addBotMessage("Our pricing starts at $499/month for the Starter plan, $999/month for Growth, and $1,999/month for Enterprise. Would you like more details about what's included in each plan?", [
                "Starter plan details",
                "Growth plan details",
                "Enterprise plan details",
                "Get a custom quote"
            ]);
        } else if (query.includes('compare') || query.includes('vs') || query.includes('hubspot') || query.includes('better')) {
            this.addBotMessage("Compared to traditional marketing agencies or platforms like HubSpot, our AI-powered approach offers 24/7 availability, real-time analytics, personalization at scale, continuous optimization, and typically costs 40-60% less.");
            this.addBotMessage("Would you like to see a detailed comparison or learn more about specific advantages?", [
                "See detailed comparison",
                "Learn about advantages",
                "Schedule a demo"
            ]);
        } else if (query.includes('contact') || query.includes('human') || query.includes('support') || query.includes('talk')) {
            this.addBotMessage("If you'd like to speak with a human, I can connect you with our team. Please provide your email, and someone will reach out within 1 business day.");
            this.currentStep = 'human_contact';
        } else {
            this.addBotMessage("I'm sorry, I didn't quite understand that. Could you try rephrasing or choose one of these options?", [
                "Learn about services",
                "Schedule a demo",
                "Get a quote",
                "Talk to a human"
            ]);
        }
    }
    
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

// Initialize the chatbot when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create chat widget elements
    const chatWidget = document.createElement('div');
    chatWidget.innerHTML = `
        <div id="chat-toggle" class="chat-toggle">
            <span class="chat-icon">💬</span>
            <span class="chat-label">Chat with NexusAI</span>
        </div>
        <div id="chat-container" class="chat-container">
            <div class="chat-header">
                <h3>NexusAI Assistant</h3>
                <button id="close-chat" class="close-chat">×</button>
            </div>
            <div id="chat-messages" class="chat-messages"></div>
            <div class="chat-input-container">
                <input id="chat-input" type="text" placeholder="Type your message here...">
                <button id="chat-send" class="chat-send">
                    <span>Send</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatWidget);
    
    // Initialize the chatbot
    new NexusAIChatbot();
    
    // Add chat widget styles
    const chatStyles = document.createElement('style');
    chatStyles.innerHTML = `
        .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary, #6366f1);
            color: white;
            padding: 12px 20px;
            border-radius: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .chat-toggle:hover {
            background-color: var(--primary-dark, #4f46e5);
            transform: translateY(-2px);
        }
        
        .chat-icon {
            font-size: 20px;
            margin-right: 8px;
        }
        
        .chat-container {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.9);
            opacity: 0;
            pointer-events: none;
            transform-origin: bottom right;
            transition: all 0.3s ease;
        }
        
        .chat-open {
            transform: scale(1);
            opacity: 1;
            pointer-events: all;
        }
        
        .chat-header {
            background-color: var(--primary, #6366f1);
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-header h3 {
            margin: 0;
            font-size: 16px;
        }
        
        .close-chat {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }
        
        .chat-messages {
            flex-grow: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .chat-message {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 15px;
            margin-bottom: 5px;
            word-wrap: break-word;
        }
        
        .bot-message {
            background-color: #f0f0f0;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
        }
        
        .user-message {
            background-color: var(--primary, #6366f1);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 5px;
        }
        
        .chat-options {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 5px;
            margin-bottom: 15px;
        }
        
        .chat-option {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            color: #495057;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .chat-option:hover {
            background-color: #e9ecef;
            color: var(--primary, #6366f1);
        }
        
        .chat-input-container {
            display: flex;
            padding: 10px;
            border-top: 1px solid #e9ecef;
        }
        
        #chat-input {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            outline: none;
        }
        
        .chat-send {
            background-color: var(--primary, #6366f1);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 0 15px;
            margin-left: 5px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .chat-send:hover {
            background-color: var(--primary-dark, #4f46e5);
        }
        
        @media (max-width: 576px) {
            .chat-container {
                width: calc(100% - 40px);
                right: 20px;
                bottom: 80px;
            }
            
            .chat-toggle {
                right: 20px;
            }
        }
    `;
    document.head.appendChild(chatStyles);
});
