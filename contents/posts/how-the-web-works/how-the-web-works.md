---
id: how-the-web-works
title: "How the Web Works: A First-Principles Guide"
author: Prottoy Fuad
date: "14122024"
---

> *If you can't explain it simply, you don't understand it well enough. — Richard Feynman*

Imagine you are sitting in a restaurant. 

You read the menu, you tell the waiter what you want, the waiter goes to the kitchen, the chef cooks the meal, and the waiter brings it back to your table. You don’t need to know how the oven works, where the chef bought the tomatoes, or how the plates are washed. You just know that when you ask for food, it arrives.

The entire internet operates on exactly this principle. 

When you type a website address into your phone and press enter, you are placing an order. The phone is you. The website is the meal. But what happens in the milliseconds between pressing enter and the page appearing? What exactly *is* the waiter, the kitchen, and the chef?

Let’s tear the web apart and look at the gears. No jargon. No assumed knowledge. Just the physical reality of how the modern world talks to itself. Grab a coffee; this is a comprehensive journey from the copper wires buried under the ocean to the pixels glowing on your screen.

---

## Part 1: The Physical Reality (It's Just Cables)

We often use the word "cloud," which evokes a fluffy, ethereal magic floating above us. The term was invented by marketing departments to make computing sound friendly. 

Forget the cloud. The cloud does not exist. 

The internet is a physical, tangible thing. It is a massive network of physical computers connected by copper wires, fiber optic cables, and radio waves. When you upload a photo to "the cloud," it is literally traveling through a wire out of your house, across your city, and saving itself onto a spinning hard drive inside a noisy, air-conditioned warehouse owned by Amazon, Google, or Microsoft.

### Clients and Servers
In our restaurant analogy, there are two primary roles on the web:
1. **The Client:** This is the computer asking for things. Usually, it's the web browser on your phone, laptop, or smart TV. You are the customer at the table.
2. **The Server:** This is the computer answering the request. It is a high-powered machine running 24 hours a day, 7 days a week, doing nothing but waiting to be asked for a file. It is the kitchen.

The web is, at its absolute core, just clients asking servers for documents, and servers sending those documents back over cables.

### The Address System: IP Addresses
If you want to send a letter to a friend, you need their street address. On the internet, every single device—your phone, your smart fridge, and the massive Google servers—has a unique number called an **IP Address** (Internet Protocol Address). 

An IPv4 address looks like this: `104.26.10.234`. 
Because the world ran out of these combinations, we invented IPv6, which looks like this: `2600:1f14:3a00:2::10`. 

When your phone wants to talk to a server, it needs to know the server's IP address to route the message through the maze of global cables.

### The Phonebook: DNS
But humans are terrible at remembering random strings of numbers. You don't memorize the geographic coordinates of your favorite restaurant; you just remember its name, like "Bob's Burgers." 

To solve this, the internet uses the **Domain Name System (DNS)**. DNS is simply the internet’s phonebook. It translates human-readable names (like `google.com`) into computer-readable IP addresses.

When you type a website into your browser, a frantic, multi-step search occurs in milliseconds:
1. **The Browser Cache:** Your browser checks if you visited this site recently. If you did, it already knows the IP address.
2. **The OS Cache:** If the browser doesn't know, it asks your computer's operating system.
3. **The Resolver:** If your computer doesn't know, it asks your Internet Service Provider (like Comcast or AT&T). 
4. **The Root Servers:** If your ISP doesn't know, it asks the global "Root Servers"—the absolute top of the internet hierarchy. There are only 13 logical root servers in the world. They act as the librarians of the internet.
5. **The Authoritative Name Server:** The root server points your ISP to the specific server that holds the records for that website. The IP is found, and sent all the way back down the chain to your phone.

Now, your phone knows exactly where to send its message.

### The Maze: BGP Routing
Knowing the destination's address is only half the battle. How does the message actually get there? 

If you are in New York and the server is in London, your message has to cross the Atlantic Ocean. It travels through your home router, to a street cabinet, to your ISP's regional center, and then it hits the backbone of the internet. 

The internet uses a protocol called **BGP (Border Gateway Protocol)** to find the fastest path. Think of BGP as Google Maps for data. The internet is constantly shifting—cables get cut by sharks, servers go down, traffic jams occur. BGP constantly recalculates the fastest route from router to router across the globe. Your message might bounce through 15 different physical locations before it finally reaches the server in London.

---

## Part 2: The Conversation (TCP and TLS)

Your phone has found the path to the server. Now it needs to establish a connection. You can't just shout across the internet and hope the server hears you. You need a reliable connection.

### The Handshake: TCP
The internet uses a protocol called **TCP (Transmission Control Protocol)** to guarantee that messages are delivered reliably. The internet is chaotic; packets of data get lost all the time. TCP is the supervisor that ensures everything arrives in order.

Before any actual data is sent, the client and server perform a "Three-Way Handshake" to establish trust:
1. **SYN (Synchronize):** The client sends a tiny message saying, *"Hello, I would like to talk to you. Are you there?"*
2. **SYN-ACK (Synchronize-Acknowledge):** The server receives it and replies, *"Hello! I am here, and I am ready to talk."*
3. **ACK (Acknowledge):** The client replies, *"Great, I heard you. Let's begin."*

Only after this elaborate greeting does the actual conversation start. 

### The Armor: TLS (The 'S' in HTTPS)
In the early days of the web, conversations were sent in "plaintext." This meant that anyone sitting between you and the server—your ISP, a hacker on the same coffee shop Wi-Fi, a government agency—could read exactly what you were sending. If you typed a password, they saw your password.

To fix this, we created **TLS (Transport Layer Security)**. This is the `s` in `https://`. 

TLS encrypts the conversation using incredibly complex mathematics (Prime Number Factorization and Elliptic Curves). Without diving into the math, it works like this:
The server sends your browser an open padlock (a Public Key). Your browser writes its message, puts it in a box, and snaps the padlock shut. The *only* person in the universe who has the key to open that padlock is the server (the Private Key). 

Even if a hacker intercepts the box as it travels across the Wi-Fi network, all they see is scrambled, unbreakable gibberish. This mathematical armor is what makes online banking, shopping, and private messaging possible.

---

## Part 3: Placing the Order (HTTP)

The physical connection is made. The armor is on. Now, it's time for the waiter to take your order to the kitchen. The language they speak is **HTTP (Hypertext Transfer Protocol)**.

HTTP is surprisingly readable. It is not complex binary code; it is literally just text.

When you click a link, your browser sends a request that looks exactly like this:
```
GET /articles/how-the-web-works HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (iPhone; Safari)
Accept-Language: en-US
```

Let's break down this order ticket:
- **The Verb:** `GET`. This tells the server what you want to do. You want to *get* a document. If you were submitting a login form, the verb would be `POST` (you are giving data to the server). If you were deleting a photo, the verb would be `DELETE`.
- **The Path:** `/articles/how-the-web-works`. This tells the server exactly which file you are looking for.
- **The Headers:** The rest of the lines are metadata. `User-Agent` tells the server what kind of device you are using, so the server can send a mobile-friendly version of the site if necessary. `Accept-Language` tells the server you prefer English.

### The Kitchen's Reply
The server reads this text ticket, gathers the requested document, and sends a text reply back:

```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 5042

<!DOCTYPE html>
<html>
... (the actual webpage code) ...
</html>
```

The most important part of the reply is the **Status Code**. It is a three-digit number that summarizes how the transaction went:
- **200 OK:** Success. Here is your food.
- **301 Moved Permanently:** That article moved. I'm redirecting you to the new location.
- **401 Unauthorized:** You need to log in to see this.
- **404 Not Found:** You ordered something that isn't on the menu.
- **500 Internal Server Error:** The kitchen caught on fire. The server encountered a bug in its own code.

Every single interaction on the web—loading a page, "liking" a photo, sending a chat message—is just a variation of this simple text-based request and response cycle.

---

## Part 4: Plating the Food (The Browser Engine)

When the server replies with a `200 OK`, it sends back the code for the webpage. But you don't see code. You see formatted text, colorful buttons, and images. 

Turning raw code into pixels on your screen is the job of the **Browser Engine**. Browsers like Chrome (which uses an engine called Blink) and Safari (WebKit) are some of the most complex pieces of software ever written. Their job is to parse three distinct languages and combine them instantly.

### HTML is the Nouns
HTML (Hypertext Markup Language) provides the structure. It tells the browser *what* things are. 
*"This is a heading. This is a paragraph. This is an image. This is a button."*
If a website were a house, HTML is the wooden framing and the bricks. 

When the browser receives the HTML, it reads it top-to-bottom and builds an invisible family tree in its memory called the **DOM (Document Object Model)**. The `<html>` tag is the grandparent, the `<body>` is the parent, and the `<p>` (paragraph) tags are the children. 

### CSS is the Adjectives
HTML by itself is ugly. It's just black text on a white background. CSS (Cascading Style Sheets) provides the design. It tells the browser what things *look like*.
*"Make the heading blue. Put a margin around the paragraph. Make the button rounded."*
In our house analogy, CSS is the paint on the walls, the carpets, and the interior decorating.

The browser reads the CSS, builds another invisible tree called the **CSSOM**, and merges it with the DOM. Now the browser knows not only that there is a button, but that the button should be blue.

### Layout and Paint
With the structures and styles combined, the browser calculates the **Layout**. It does complex math to figure out exactly how many pixels wide the button should be, and exactly where it should sit on your specific screen size. 

Finally, the browser **Paints**. It sends instructions to your computer's graphics card to color the actual physical pixels on your monitor. All of this—parsing, building trees, calculating layout, and painting—happens in a few milliseconds.

### JavaScript is the Verbs
If HTML is the nouns and CSS is the adjectives, JavaScript provides the behavior. It makes the website *do* things without having to talk to the server again.
*"When the user clicks the blue button, make a popup appear. If they type a weak password, show a warning in red."*
JavaScript is the electricity and the plumbing in the house. It brings the structure to life.

Browsers have a dedicated "engine" just for running JavaScript (Chrome's is called V8). As soon as the browser downloads a JavaScript file, the V8 engine uses a technique called JIT (Just-In-Time) compilation. It translates the human-readable JavaScript into machine code (1s and 0s) right there on your computer, allowing it to run at blisteringly fast speeds.

In the early days of the web, JavaScript was only used for tiny things like making snow fall on a page. Today, JavaScript is a powerhouse. Entire applications (like Google Docs or Spotify) are massive JavaScript programs downloaded to your browser, running in real-time on your machine. We call these **Single Page Applications (SPAs)**, and they are usually built with **Frontend Frameworks** like React, Vue, or Angular, which make managing complex JavaScript easier for developers.

---

## Part 5: The Kitchen (Inside the Backend)

So far, we've talked about the client (the frontend). But what actually happens inside the server (the backend)?

If you build a website that just shows a static blog post, you don't need a complex backend. You just put an HTML file on a computer, and when someone asks for it, a simple web server (like Nginx) hands it over. 

But what if you are building Twitter? You can't have a static HTML file for Twitter, because the content is different every second, and it's different for every single user. 

This requires a **Backend Application**. 

When your HTTP request arrives at the server, it is handed over to a custom program written by developers (often in languages like Python, Java, Node.js, C#, or Go). This program's job is to act as the head chef. 

Here is exactly what the backend program does when it receives a request to "Post a Tweet":
1. **Routing:** The backend looks at the HTTP Path (`/post-tweet`). It has a map that says, *"Ah, if the path is `/post-tweet`, I need to run the `SaveTweet` function."*
2. **Middleware (The Bouncers):** Before the function runs, the request goes through middleware. This checks things like: *"Is this user logged in? Do they have a valid session token? Are they sending too many requests too fast?"* If the middleware fails, it rejects the request with a `401 Unauthorized` status code.
3. **Business Logic:** If the bouncers let the request through, the actual function runs. The backend checks the length of the tweet. *"Is it under 280 characters?"* If yes, it proceeds.
4. **Database Interaction:** The backend takes the text of the tweet and sends it to the database to be saved permanently.

### The Database: The Kitchen's Pantry
Servers turn off. Programs crash. If a computer restarts, anything in its active memory is wiped out forever. 

To prevent you from losing your account every time Twitter updates their servers, the backend writes your data into a **Database**. A database is a highly specialized piece of software designed to do one thing perfectly: save data securely on a hard drive, and find it incredibly fast when asked. 

There are two main types:
- **Relational Databases (SQL):** These are like massive Excel spreadsheets. They have tables with strict columns and rows. They are perfect for highly structured data with clear relationships (e.g., Users have Orders, Orders have Items). Under the hood, they use complex data structures called B-Trees to find a single row among billions in milliseconds.
- **Document Databases (NoSQL):** These are more like filing cabinets full of flexible text documents. They are great when data doesn't fit neatly into a rigid table structure.

When you load your profile, the backend asks the database, "Find all tweets by this user." The database searches its billions of records, hands them to the backend program, the backend formats them into a neat JSON package, and ships them back to your browser.

---

## Part 6: Escaping the Cycle (WebSockets)

For decades, the web strictly followed the restaurant rules: The waiter only brings you food if you order it. The server *never* talks to the client unless the client asks a question first. Every HTTP conversation is initiated by the client.

But what about a chat app like WhatsApp or Slack? If your friend sends you a message, your phone didn't ask the server for it. The server somehow pushed it to your phone instantly. How is this possible if HTTP only works when the client asks?

Early on, developers used a hack called "Long Polling." The phone would ask the server, *"Any new messages?"* The server would say, *"No."* A second later, the phone would ask again. This was incredibly inefficient.

To fix this, the industry invented **WebSockets**. 

A WebSocket starts as a normal HTTP request. Your phone says to the server, *"Hey, I'd like to upgrade this standard HTTP conversation to a WebSocket."* 
The server says, *"Okay, I agree."* 

Instead of hanging up after the reply, the client and server agree to leave the TCP connection completely open. It becomes a persistent, two-way pipe. Now, the rules are broken. Whenever the server receives a message from your friend, it doesn't wait for your phone to ask. It immediately shoves the message down that open pipe to your phone, with zero delay. It enables real-time, instantaneous magic.

---

## Summary: The Whole Picture

The next time you open an app on your phone, visualize the invisible choreography happening in the air around you.

Your phone asks the DNS phonebook to translate a name into a string of numbers. It negotiates a secure, encrypted TCP handshake across the ocean through fiber optic cables. It fires a text-based HTTP request. A fortress of a backend server receives it, verifies who you are, asks a hyper-fast filing cabinet (the database) for your information, stitches together the ingredients, and fires them back. Your phone's browser engine receives the ingredients, builds the invisible DOM trees, paints the structural nouns, applies the stylistic adjectives, and wakes up the interactive JavaScript verbs via the V8 engine. 

And all of this massive, global, distributed machinery operates flawlessly in less time than it takes to blink. That is the web.
