"use client";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function Home() {
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You are an AI customer support assistant for HeadstarterAI, a platform that conducts AI-powered interviews for software engineering jobs. Your primary role is to assist users with questions about the platform, troubleshoot issues, and provide guidance on using HeadstarterAI effectively. Key responsibilities: Answer questions about HeadstarterAI's features, pricing, and interview process. Assist users with account-related issues, such as registration, login problems, and subscription management. Provide technical support for any platform-related issues users may encounter during their interviews. Offer guidance on how to prepare for AI-powered interviews and make the most of the HeadstarterAI platform. Explain the benefits of using HeadstarterAI for both job seekers and employers. Address concerns about AI bias, data privacy, and the fairness of AI-powered interviews. Collect user feedback and suggestions for improving the platform. Guidelines: Always maintain a professional, friendly, and helpful tone. Provide clear and concise answers, offering to elaborate when necessary. If you don't have an answer, admit it and offer to escalate the issue to human support. Use simple language and avoid technical jargon unless specifically asked about technical details. Respect user privacy and never ask for sensitive information like passwords or payment details. Encourage users to visit the HeadstarterAI website or documentation for in-depth information on specific topics. If users express frustration, empathize with their situation and focus on finding solutions. Remember, your goal is to ensure users have a positive experience with HeadstarterAI and feel supported throughout their journey on the platform.",
  });

  const [messages, setMessages] = useState([
    {
      role: "model",
      content:
        "Hi, I'm the Headstarter support agent. How can I assist you today?",
    },
  ]);

  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "model", content: "..." },
    ]);

    const result = await model.generateContent(
      JSON.stringify([...messages, { role: "user", content: message }])
    );

    console.log(typeof result);
    console.log(typeof result.response);

    const res = await result.response.text();
    const parsedRes = JSON.parse(res);

    let response = "";
    if (Array.isArray(parsedRes)) {
      response = parsedRes[0]?.content;
    } else {
      response = parsedRes.content;
    }

    setMessages((messages) => {
      //let lastMessage = messages[messages.length - 1]
      let otherMessages = messages.slice(0, messages.length - 1);
      return [
        ...otherMessages,
        {
          //...lastMessage,
          role: "model",
          content: response,
        },
      ];
    });
  };

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
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      bgcolor="#d1eeee"
      sx={{background: 'linear-gradient(to bottom, #d1eeee, #2986cc)'}}
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography fontSize="34px" fontWeight="bold" color="white" sx={{background: 'linear-gradient(to right bottom, #9440a0, #2986cc)'}} borderRadius={8} p={2} marginTop={2}>
        AI Customer Support
      </Typography>
      <Box
        width="100vw"
        height="90vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          bgcolor="#d8e8e8"
          direction="column"
          sx={{ width: { xs: "80%", sm: "65%", md: "50%" }, }}
          height="90%"
          border="2px solid #19527d"
          borderRadius={2}
          p={2}
          spacing={2}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
            p={1}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "model" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  sx={{background: message.role === "model" ? 'linear-gradient(to right, #2986cc, #19527d)' : 'linear-gradient(to left, #9440a0, #674ea7)'}}
                  color="white"
                  borderRadius={6}
                  p={2}
                  ref={scrollRef}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>

          <form
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
            onSubmit={sendMessage}
          >
            <TextField
              sx={{ my: 2 }}
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              sx={{ height: "55px" }}
              variant="contained"
              onClick={sendMessage}
            >
              Send
            </Button>
          </form>
        </Stack>
        <StyledRating
          display="flex"
          name="highlight-selected-only"
          defaultValue={3}
          IconContainerComponent={IconContainer}
          getLabelText={(value) => customIcons[value].label}
          highlightSelectedOnly
        />
      </Box>
    </Box>
  );
}
