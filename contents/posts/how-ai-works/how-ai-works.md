---
id: how-ai-works
title: "How AI Works: The Autocomplete Engine That Learned to Reason"
author: Prottoy Fuad
date: "15022025"
---

If you’ve ever typed a text message on your phone and tapped the middle suggestion button over and over to see what kind of weird sentence it creates, you already understand the fundamental mechanism of modern Artificial Intelligence. 

The industry uses intimidating words like "Neural Networks," "Large Language Models," and "Generative Pre-trained Transformers." We talk about these systems as if they are digital brains, possessing intelligence, reasoning, and creativity. But strip away the mathematics, the marketing, and the billions of dollars of computing power, and what you are left with is a machine that is doing one very simple thing:

**It is guessing the next word.**

How did guessing the next word lead to machines that can write software, pass bar exams, summarize 100-page legal documents, and hold philosophical conversations? Let’s break down the illusion of AI, step-by-step, from absolute zero. 

---

## Part 1: The Core Illusion (Tokens and Probabilities)

When you ask an AI a question, it does not "think" about the answer the way a human does. It does not have an internal database of facts that it looks up. It has no inner monologue.

Instead, it reads your question and asks itself a purely mathematical question: *"Based on everything I have ever read on the internet, what is the most statistically likely word to come next?"*

Actually, it doesn't even use words. It uses **Tokens**. 

A token is a fragment of a word. A short, common word like "apple" might be one token. But a longer word like "Hamburger" might be split into three tokens: "Ham", "bur", and "ger". Why? Because there are millions of words in English, but if you break them down into syllables and common prefixes/suffixes, there are only about 100,000 common tokens. This makes the math much, much faster for the computer to process. 

If you type the prompt: *"The sky is"*, the model looks at those tokens, runs a massive mathematical equation, and calculates a probability distribution for every single token in its vocabulary. It might determine that the token *"blue"* has a 98% chance of coming next, *"dark"* has a 1% chance, and *"falling"* has a 0.01% chance. 

It picks *"blue"* and outputs it. 

But it doesn't stop there. Now it looks at the *new* sentence—*"The sky is blue"*—and runs the entire calculation again to guess the next token. It repeats this process, over and over, one single token at a time, until it guesses a special invisible token called `<|endoftext|>` which tells it to stop talking.

### How Does it Learn? (Neural Networks)
How does it know that "blue" comes after "The sky is"? 

During a process called **Training**, engineers feed the AI essentially the entire public internet: every Wikipedia article, every Reddit post, every digitized book, and every piece of open-source code. 

The AI is built on a **Neural Network**. Imagine a giant spreadsheet with billions of dials (called *Parameters* or *Weights*). The AI reads a sentence from Wikipedia: *"The capital of France is Paris."* 
The engineers hide the word "Paris" and ask the AI to guess it. Because the dials are initially set to random numbers, the AI guesses "banana." 

The engineers tell the AI, *"Wrong. It was Paris."* 

Through a mathematical process called **Backpropagation**, the AI slightly adjusts millions of those dials so that next time, it is slightly more likely to guess "Paris." It does this billions of times, across trillions of words, using thousands of supercomputers running for months. Eventually, the dials are perfectly tuned to capture the grammatical structure and factual relationships of human language.

---

## Part 2: The Transformer Breakthrough (Attention)

If an AI is just guessing the next word, why doesn't it just spit out random, grammatically correct nonsense? How does it stay on topic for a 5-page essay?

In older AI models (like RNNs), the AI had "amnesia." If it was generating a long sentence, by the time it got to the end, it had mathematically forgotten the words at the beginning. If it read the word "bank," it didn't know if you meant a river bank or a financial bank. 

The breakthrough that made modern AI possible (the "T" in ChatGPT stands for Transformer) was a paper published by Google in 2017 called *Attention Is All You Need*. It introduced a mechanism called **Self-Attention**. 

The Attention mechanism allows the model to look backward at *every single token* in your prompt simultaneously. When calculating the next word, it assigns an "attention score" to how strongly related every previous word is to the current one. 

If it encounters the word "bank," it scans the previous text. If the word "river" appeared 500 words ago, the attention mechanism creates a strong mathematical link between them. The meaning of "bank" shifts away from finance and towards nature. 

This ability to maintain deep, complex context across thousands of words is what creates the illusion of reasoning. The model isn't thinking; it is generating text that perfectly fits the mathematical shape of the entire conversation.

---

## Part 3: The Goldfish Problem (Context Windows)

Here is the most surprising fact about talking to an AI: **It has zero memory.**

When you chat with an AI for an hour, it feels like it remembers what you said five minutes ago. It doesn't. The model is completely stateless. The second it finishes printing a word, its mind is entirely wiped clean. It is a function: text goes in, text comes out. 

So how does it remember your name?

**The conversation is an illusion maintained by your software.** Every single time you send a new message, the chat app (like the ChatGPT web interface) secretly takes your *entire chat history*, bundles it up, and sends the whole thing back to the AI. 

If you say, "My name is John," the AI replies "Hi John."
When you later say, "What is my name?", the software actually sends this massive block of text to the AI:
```
User: My name is John.
AI: Hi John.
User: What is my name?
```

The AI reads that entire script from scratch, uses its Attention mechanism to link "name" to "John", and its math concludes the next logical word is "John". 

This is called the **Context Window**. Models have a strict physical limit on how many tokens they can read at once (early models could read 4,000 tokens; today's can read 1,000,000). Every time you send a message, you pay a computational cost to re-process the entire conversation. If your conversation gets too long and exceeds the Context Window, the software has to start deleting the oldest messages before sending the bundle to the AI. 

When that happens, the AI suddenly "forgets" things you said at the beginning of the chat—because those words were literally not included in the prompt.

---

## Part 4: The Open-Book Test (RAG and Embeddings)

If an AI only guesses the next word based on what it read during its initial training, it has a massive problem: **Its knowledge is frozen in time.** 

If you ask an AI trained in 2023 who won the Super Bowl in 2025, it cannot possibly answer correctly. Worse, because it is designed to generate fluent text rather than verify truth, it will happily invent an answer. It will confidently tell you the Detroit Lions won, complete with fake statistics. This is called a **Hallucination**.

To fix this, engineers don't retrain the whole model (which costs millions of dollars). Instead, they give the AI an open-book test using a technique called **RAG (Retrieval-Augmented Generation)**.

Imagine asking a student a highly specific question about 18th-century French tax law. Instead of hoping they memorized it, you hand them a textbook, point to the correct page, and say, *"Read this, and then answer the question using only what you read."*

That is RAG. But how does the computer find the correct page?

### The Magic of Embeddings
Computers can't "read" concepts. If you search for "dogs," a traditional search engine looks for the exact word "dogs." If the document says "canine," it misses it entirely. 

To solve this, AI uses **Embeddings**. An embedding is a way of translating a concept into a mathematical coordinate in high-dimensional space (often 1,500 dimensions). 
- The coordinate for "Dog" is placed very close to "Puppy" and "Canine."
- It is placed somewhat close to "Cat" (because they are both pets).
- It is placed extremely far away from "Carburetor."

When you ask an AI about your company's private HR policy:
1. The software takes your question and turns it into a coordinate (a Vector).
2. It goes to a specialized **Vector Database** that holds all your company's documents, which have also been mapped as coordinates.
3. It performs a rapid mathematical calculation to find the document chunks that are physically closest to your question in that 1,500-dimensional space. (It realizes "time off" is very close to "vacation policy").
4. It extracts the text of those closest documents and silently pastes them into your prompt.
5. The final prompt sent to the AI looks like this:
   *"Here is some background information: [Pasted HR Documents]. Now, answer the user's question: [How many vacation days do I get?]"*

When the AI gives you a brilliantly accurate answer about your proprietary data, it didn't learn it. You just handed it the answer key right before it spoke. **When the answer is wrong, it's usually the retrieval that failed, not the model.**

---

## Part 5: Giving it Hands (Tool Use and Agents)

Guessing the next word is great for writing poems, summarizing documents, or writing code. But what if you want the AI to *actually do something*? What if you want it to book a flight, run a database query, or delete a file? 

An AI cannot click buttons. It is just a text generator trapped in a box on a server. It has no hands.

To solve this, we invented **Tool Use**. 

When engineers build an AI application, they include hidden instructions in a "System Prompt" before the user even types a word. It looks like this:
*"You are a helpful assistant. You cannot browse the web yourself. But if you need to know the weather, don't guess. Instead, output a specific text command formatted exactly like this: `{"tool": "get_weather", "location": "London"}`."*

Now, the software running the AI watches the output stream like a hawk. When the AI outputs that JSON text command, the software hits the pause button. 

The *software* (not the AI) goes out, connects to a real weather API, gets the result ("It is raining, 50 degrees"), and pastes that result back into the chat history. Then it hits play on the AI again. 

The AI reads its own previous request, reads the new weather data, and finally generates the text for the user: *"You should bring an umbrella; it's raining and 50 degrees in London."*

### The Agent Loop
When you put this all together, you create something incredibly powerful: an **Agent**.

An agent is a software loop built *around* an LLM. It gives the AI a goal, and the AI reasons through it step-by-step:
1. **Thought:** The user wants to know if they can afford a house. I need to calculate their salary.
2. **Action:** Call the `get_salary` tool for this user.
3. **Observation:** *[Software runs the database query and returns $100,000]*
4. **Thought:** Now I need to check current mortgage rates.
5. **Action:** Call the `web_search` tool for "current US mortgage rates."
6. **Observation:** *[Software searches the web and returns 6.5%]*
7. **Final Answer:** Based on your salary of $100k and current rates of 6.5%, you can afford...

By linking a stateless text-generator to real-world tools, we create autonomous systems that can read git repositories, write SQL, browse the web, and solve complex multi-step problems without human intervention.

---

## Part 6: The Reality Check

As we integrate AI into our daily lives and software products, the most important lesson is to stop treating it like a junior colleague, and start treating it like a hyper-advanced calculator.

Text goes in, text comes out. It has no intent, no malice, no consciousness, and no ability to flag when it is unsure. Fluency and accuracy are produced by the exact same mathematical machinery, which is exactly why a fluent, fabricated answer sounds just as confident as a truthful one. Verification is your system's job; it is never the model's.

When you understand the gears—Tokens, Attention, Context Windows, Vector Embeddings, RAG, and Tool Use—the magic fades. But when the magic fades, the utility skyrockets. You stop asking it to memorize the world, and start using it as an incredibly powerful reasoning engine for processing the context you provide.
