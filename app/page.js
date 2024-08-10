'use client';
import Image from "next/image";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function Home() {
	const { GoogleGenerativeAI } = require("@google/generative-ai")

	const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

	const model = genAI.getGenerativeModel({
		model: "gemini-1.5-flash",
		systemInstruction: "You are an AI customer support assistant for HeadstarterAI, a platform that conducts AI-powered interviews for software engineering jobs. Your primary role is to assist users with questions about the platform, troubleshoot issues, and provide guidance on using HeadstarterAI effectively. Key responsibilities: Answer questions about HeadstarterAI's features, pricing, and interview process. Assist users with account-related issues, such as registration, login problems, and subscription management. Provide technical support for any platform-related issues users may encounter during their interviews. Offer guidance on how to prepare for AI-powered interviews and make the most of the HeadstarterAI platform. Explain the benefits of using HeadstarterAI for both job seekers and employers. Address concerns about AI bias, data privacy, and the fairness of AI-powered interviews. Collect user feedback and suggestions for improving the platform. Guidelines: Always maintain a professional, friendly, and helpful tone. Provide clear and concise answers, offering to elaborate when necessary. If you don't have an answer, admit it and offer to escalate the issue to human support. Use simple language and avoid technical jargon unless specifically asked about technical details. Respect user privacy and never ask for sensitive information like passwords or payment details. Encourage users to visit the HeadstarterAI website or documentation for in-depth information on specific topics. If users express frustration, empathize with their situation and focus on finding solutions. Remember, your goal is to ensure users have a positive experience with HeadstarterAI and feel supported throughout their journey on the platform."
	})

	const [messages, setMessages] = useState([{
		role: "model",
		content: "Hi, I'm the Headstarter support agent. How can I assist you today?",
	}])

	const [message, setMessage] = useState("")

	const sendMessage = async () => {
		setMessage("")
		setMessages((messages) => [
			...messages,
			{ role: "user", content: message },
			{ role: "model", content: "..." }
		])

		const result = await model.generateContent (
			JSON.stringify([{ role: "user", content: message }])
		);

		console.log(typeof result)
		console.log(typeof result.response)

		const response = result.response.text()

		setMessages((messages) => {
			//let lastMessage = messages[messages.length - 1]
			let otherMessages = messages.slice(0, messages.length-1)
			return [
				...otherMessages,
				{
					//...lastMessage,
					role: "model",
					content: response
				},
			]
		})
	}
/*
  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) =>[
      ...messages,
      {role: "user", content: message},
      {role: "assistant", content: "..."}
    ])

    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: "user", content: message}]),
    }).then( async (res)=>{
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length-1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            },
          ]
        })
        return reader.read().then(processText)
      })
    })

  }
*/
	return(
		<Box width = "100vw" height = "100vh" display = "flex" flexDirection="column" justifyContent = "center" alignItems = "center">
			<Stack direction="column" width = "600px" height = "700px" border = "1px solid black" p = {2} spacing={2}>
				<Stack direction="column" spacing = {2} flexGrow = {1} overflow = "auto" maxHeight = "100%">
					{messages.map((message, index) => (
						<Box key = {index} display = "flex" justifyContent= { message.role === "model" ? "flex-start" : "flex-end" }>
							<Box bgcolor={ message.role === "model" ? "primary.main" : "secondary.main" } color = "white" borderRadius = {16} p = {3}>
								{message.content}
							</Box>
						</Box>
						)
					)}

				</Stack>

				<Stack>
					<TextField label = "Message" fullWidth value = {message} onChange = {(e) => setMessage(e.target.value)} />
					<Button variant="contained" onClick={sendMessage}>Send</Button>
				</Stack>
			</Stack>
		</Box>
	)
}