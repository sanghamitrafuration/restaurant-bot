"use strict";

require("dotenv").config();

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const express = require("express");
const body_parser = require("body-parser");
const { UserModel } = require("./model/user-model");
const { connection } = require("./configs/db");
const axios = require("axios").default;
const app = express().use(body_parser.json()); // creates express http server
const PORT = process.env.PORT || 1337;

const foodMenu = [
  "https://i.postimg.cc/jS1xkHFQ/food-1.png",
  "https://i.postimg.cc/nc5gy3nz/food-2.png",
  "https://i.postimg.cc/sDtH61JG/food-3.png",
  "https://i.postimg.cc/ZR7VrqRR/food-4.png",
  "https://i.postimg.cc/Qx5vrpCJ/food-5.png",
  "https://i.postimg.cc/0ysF5bJR/food-6.png",
  "https://i.postimg.cc/ZRCDsNX3/food-7.png",
];
const Beverages = ["https://i.postimg.cc/wBbwNv3B/bar-12.png"];
const BarMenu = [
  "https://i.postimg.cc/4NTBVj4p/bar-1.png",
  "https://i.postimg.cc/sxC9PZz3/bar-2.png",
  "https://i.postimg.cc/02x0bmZf/bar-3.png",
  "https://i.postimg.cc/QdYQ4zD4/bar-4.png",
  "https://i.postimg.cc/52rzqF5D/bar-5.png",
  "https://i.postimg.cc/C5JBZZLP/bar-6.png",
  "https://i.postimg.cc/Z5WBR5kH/bar-7.png",
  "https://i.postimg.cc/wBJ1X4js/bar-8.png",
  "https://i.postimg.cc/xjgc3zng/bar-9.png",
  "https://i.postimg.cc/tghgZ1B3/bar-10.png",
  "https://i.postimg.cc/JnMzb1F9/bar-11.png",
];
const Ambience = [
  "https://i.postimg.cc/y889jJYb/ambience-1.jpg",
  "https://i.postimg.cc/q7tKf9Kc/ambience-2.jpg",
  "https://i.postimg.cc/1zLqyJ0k/ambience-3.jpg",
];
const TopDishes = [
  "https://i.postimg.cc/d15wrGry/dish-1.png",
  "https://i.postimg.cc/fWgMbjw4/dish-2.png",
  "https://i.postimg.cc/N04cvRNz/dish-3.png",
  "https://i.postimg.cc/D0WkGH79/dish-4.png",
  "https://i.postimg.cc/sgzfFfj1/dish-5.png",
  "https://i.postimg.cc/Fs5NcFJG/dish-6.png",
  "https://i.postimg.cc/Znktrj00/dish-7.png",
];

// Sets server port and logs message on success
// app.listen(PORT, () => console.log(`webhook is listening at ${PORT}`));

app.get("/", (req, res) => res.send("Welcome"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req, res) => {
  // Parse the request reqData from the POST
  try {
    let reqData = req.body;

    // Check the Incoming webhook message
    console.log(JSON.stringify(reqData, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (reqData.object) {
      if (
        reqData.entry &&
        reqData.entry[0].changes &&
        reqData.entry[0].changes[0] &&
        reqData.entry[0].changes[0].value.messages &&
        reqData.entry[0].changes[0].value.messages[0]
      ) {
        const phone_number_id =
          reqData.entry[0].changes[0].value.metadata.phone_number_id;
        const from = reqData.entry[0].changes[0].value.messages[0].from;
        const name = reqData.entry[0].changes[0].value.contacts[0].profile.name;
        const ifExist = await UserModel.find({ recipient: from });
        if (ifExist.length === 0) {
          const newdata = new UserModel({
            name: name,
            recipient: from,
            phone_number_id: phone_number_id,
          });
          await newdata.save();
        }
        if (reqData.entry[0].changes[0].value.messages[0].type === "text") {
          let msg_body =
            reqData.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
          console.log(
            reqData.entry[0].changes[0].value.messages[0],
            "body.entry[0].changes[0].value.messages[0]"
          );
          if (
            msg_body == "Hi" ||
            msg_body == "hi" ||
            msg_body == "Hey" ||
            msg_body == "hey" ||
            msg_body == "Hello" ||
            msg_body == "hello"
          ) {
            msg_body =
              "Welcome to *AKINA* . AKINA Mumbai, a contemporary Japanese bar & restaurant situated in the heart of Bandra. Inspired by the journey of an experience driven & hungry soul, we are carefully treading the lines between heritage and innovation. We offer rich beverage experiences and contemporary Japanese cuisine created as an ode to high-quality ingredients, traditional & modern cooking techniques and creative mixology and the world of cinematic experiences to create eccentric and memorable moments.";
            welcomeMessageMenu(phone_number_id, msg_body, from);
          } else if (
            msg_body == "Ok" ||
            msg_body == "ok" ||
            msg_body == "thanks"
          ) {
            msg_body = "Thank you for contacting us";
            okresponse(phone_number_id, from, msg_body);
          } else {
            msg_body =
              "Welcome to *AKINA* . AKINA Mumbai, a contemporary Japanese bar & restaurant situated in the heart of Bandra. Inspired by the journey of an experience driven & hungry soul, we are carefully treading the lines between heritage and innovation. We offer rich beverage experiences and contemporary Japanese cuisine created as an ode to high-quality ingredients, traditional & modern cooking techniques and creative mixology and the world of cinematic experiences to create eccentric and memorable moments.";
            welcomeMessageMenu(phone_number_id, msg_body, from);
          }
        } else if (
          reqData.entry[0].changes[0].value.messages[0].type ===
            "interactive" &&
          reqData.entry[0].changes[0].value.messages[0].interactive &&
          reqData.entry[0].changes[0].value.messages[0].interactive.type ===
            "button_reply" &&
          reqData.entry[0].changes[0].value.messages[0].interactive
            .button_reply &&
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .id
        ) {
          let msg_body =
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.title; // extract the message text from the webhook payload
          console.log(
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.title,
            "reqData.entry[0].changes[0].value.messages[0].interactive.button_reply.title"
          );

          if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_1"
          ) {
            buttonId1Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_2"
          ) {
            buttonId2Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_3"
          ) {
            buttonId3Response(phone_number_id, from, msg_body);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_4"
          ) {
            buttonId4Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_5"
          ) {
            buttonId5Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_6"
          ) {
            buttonId6Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_7"
          ) {
            buttonId7Response(phone_number_id, from);
          } else {
            noresponse(phone_number_id, from);
          }
          res.sendStatus(200);
        } else if (
          reqData.entry[0].changes[0].value.messages[0].type ===
            "interactive" &&
          reqData.entry[0].changes[0].value.messages[0].interactive &&
          reqData.entry[0].changes[0].value.messages[0].interactive.type ===
            "list_reply" &&
          reqData.entry[0].changes[0].value.messages[0].interactive
            .list_reply &&
          reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
            .id
        ) {
          let msg_body =
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .title; // extract the message text from the webhook payload
          console.log(
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .title,
            "reqData.entry[0].changes[0].value.messages[0].interactive.list_reply.title"
          );

          if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_1_ID"
          ) {
            listId1Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_2_ID"
          ) {
            listId2Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_3_ID"
          ) {
            listId3Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_4_ID"
          ) {
            listId4Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_5_ID"
          ) {
            listId5Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_6_ID"
          ) {
            listId6Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_7_ID"
          ) {
            listId7Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_8_ID"
          ) {
            listId8Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_9_ID"
          ) {
            listId9Response(phone_number_id, from);
          } else {
            noresponse(phone_number_id, from);
          }
          res.sendStatus(200);
        }
      }
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/

  const verify_token = process.env.VERIFY_TOKEN;
  console.log(req.query, "Welcome");
  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe") {
      // token === verify_token
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

const welcomeMessageMenu = (phone_number_id, msg_body, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: "AKINA",
        },
        body: {
          text: msg_body,
        },
        footer: {
          text: "Click the button to explore more",
        },
        action: {
          button: "About Us",
          sections: [
            {
              title: "Timing",
              rows: [
                {
                  id: "OUR_SERVICE_1_ID",
                  title: "Timings of Restaurant",
                },
                {
                  id: "OUR_SERVICE_2_ID",
                  title: "Is it open now?",
                },
              ],
            },
            {
              title: "Photos",
              rows: [
                {
                  id: "OUR_SERVICE_3_ID",
                  title: "Ambience Photos",
                },
                {
                  id: "OUR_SERVICE_4_ID",
                  title: "Top Dishes",
                },
              ],
            },
            {
              title: "Food",
              rows: [
                {
                  id: "OUR_SERVICE_5_ID",
                  title: "Menu",
                },
                {
                  id: "OUR_SERVICE_6_ID",
                  title: "Highlights of Restaurant",
                },
              ],
            },
            {
              title: "Find Us",
              rows: [
                {
                  id: "OUR_SERVICE_7_ID",
                  title: "Our Location",
                },
                {
                  id: "OUR_SERVICE_8_ID",
                  title: "Order Link",
                },
              ],
            },
            {
              title: "Contact",
              rows: [
                {
                  id: "OUR_SERVICE_9_ID",
                  title: "Contact Us",
                },
              ],
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId1Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Food Menu is here",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  // for(let i=0;i<foodMenu.length;i++){
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "file", // Use "file" instead of "document"
      file: {
        url: "https://drive.google.com/file/d/17GAz0kkUuEp_RXhtKLMee0ttIGZLGihz/view?usp=sharing.pdf",
      },
      // messaging_product: "whatsapp",
      // recipient_type: "individual",
      // to: from,
      // type: "document",
      // document: {
      //   link: "https://drive.google.com/file/d/17GAz0kkUuEp_RXhtKLMee0ttIGZLGihz/view?usp=sharing.pdf",
      // }
    },
    headers: { "Content-Type": "application/json" },
  });
  // }
};

const buttonId2Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Beverage Menu is Here",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  for (let i = 0; i < Beverages.length; i++) {
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "image",
        image: {
          link: Beverages[i],
        },
      },
      headers: { "Content-Type": "application/json" },
    });
  }
};

const buttonId3Response = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Bar Menu is Here",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  for (let i = 0; i < BarMenu.length; i++) {
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "image",
        image: {
          link: BarMenu[i],
        },
      },
      headers: { "Content-Type": "application/json" },
    });
  }
};

const buttonId4Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Pleas click on https://www.zomato.com/mumbai/akina-contemporary-japanese-restaurant-and-bar-linking-road-bandra-west to visit our Restaurant on Zomato",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId5Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Pleas click on https://www.swiggy.com/ to visit us on Swiggy.",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId6Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Please call on +91-8976452911",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId7Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Please mail us at hello@furation.tech",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const noresponse = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "We will contact you",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const okresponse = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: msg_body,
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId1Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: " *Monday* *-* *7:30pm-1am* \n *Tuesday* *-* *7:30pm-1am* \n *Wednesday* *-* *7:30pm-1am* \n *Thursday* *-* *7:30pm-1am* \n *Friday* *-* *7:30pm-1am* \n *Saturday* *-* *12:30pm-3:30pm,* *7:30pm-1am* \n *Sunday* *-* *12:30pm-3:30pm,* *7:30pm-1am*",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId2Response = (phone_number_id, from) => {
  const date = new Date();
  const day = date.getDay();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  let answer = false;
  if (day === 0 || day === 6) {
    if (hour <= 1 && minutes <= 0) {
      answer = true;
    } else if (hour >= 12 && minutes >= 30 && hour <= 15 && minutes <= 30) {
      answer = true;
    } else if (hour >= 19 && minutes >= 30 && hour <= 23 && minutes <= 59) {
      answer = true;
    } else {
      answer = false;
    }
  } else {
    if (hour <= 1 && minutes <= 0) {
      answer = true;
    } else if (hour >= 19 && minutes >= 30 && hour <= 23 && minutes <= 59) {
      answer = true;
    } else {
      answer = false;
    }
  }
  const reply =
    answer === true
      ? "Yes, We are open now"
      : "We are sorry to say that we are closed now";
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: reply,
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId3Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Here are Photos of the Ambience",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  for (let i = 0; i < Ambience.length; i++) {
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "image",
        image: {
          link: Ambience[i],
        },
      },
      headers: { "Content-Type": "application/json" },
    });
  }
};

const listId4Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Photos of Top Dishes",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  for (let i = 0; i < TopDishes.length; i++) {
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "image",
        image: {
          link: TopDishes[i],
        },
      },
      headers: { "Content-Type": "application/json" },
    });
  }
};

const listId5Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Menu",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Please Select Menu type",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_1",
                title: "Food Menu",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_2",
                title: "Beverages",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_3",
                title: "Bar Menu",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId6Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "We at Akina, are carefully treading the lines between heritage and innovation. We offer rich beverage experiences and contemporary Japanese cuisine created as an ode to high-quality ingredients, traditional & modern cooking techniques and creative mixology and the world of cinematic experiences to create eccentric and memorable moments.",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  for (let i = 0; i < Ambience.length; i++) {
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "image",
        image: {
          link: Ambience[i],
        },
      },
      headers: { "Content-Type": "application/json" },
    });
  }
  for (let i = 0; i < TopDishes.length; i++) {
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "image",
        image: {
          link: TopDishes[i],
        },
      },
      headers: { "Content-Type": "application/json" },
    });
  }
};

const listId7Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "location",
      location: {
        longitude: "72.83548324964343",
        latitude: "19.059504187994314",
        name: "AKINA",
        address:
          "Golden Palace, Turner Rd, opposite Mala Sinha Bunglow, Bandra West, Mumbai, Maharashtra 400050",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId8Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Order Link",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Order Link",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_4",
                title: "Zomato",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_5",
                title: "Swiggy",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId9Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Menu",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Please select the menu type",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_6",
                title: "Phone",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_7",
                title: "Email",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

app.post("/sendmessage", (req, res) => {
  try {
    let body = req.body;
    if (body.message && body.image) {
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          body.phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: body.recipient,
          type: "text",
          text: {
            // the text object
            body: body.message,
          },
        },
        headers: { "Content-Type": "application/json" },
      });
      for (let i = 0; i < body.image.length; i++) {
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v12.0/" +
            body.phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: body.recipient,
            type: "image",
            image: {
              link: body.image[i],
            },
          },
          headers: { "Content-Type": "application/json" },
        });
      }
      res.send({ message: "Message and Images sent" });
    } else if (body.image) {
      for (let i = 0; i < body.image.length; i++) {
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v12.0/" +
            body.phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: body.recipient,
            type: "image",
            image: {
              link: body.image[i],
            },
          },
          headers: { "Content-Type": "application/json" },
        });
      }
      res.send({ message: "Images sent" });
    } else {
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          body.phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: body.recipient,
          type: "text",
          text: {
            // the text object
            body: body.message,
          },
        },
        headers: { "Content-Type": "application/json" },
      });
      res.send({ message: "Messagesent" });
    }
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
});

app.post("/bulkmessage", (req, res) => {
  try {
    let body = req.body;
    let recipient = body.excel.phone;
    let phone_number_id = body.excel.phone_number_id;
    if (body.message && body.image) {
      for (let j = 0; j < recipient.length; j++) {
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v12.0/" +
            phone_number_id[j] +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: recipient[j],
            type: "text",
            text: {
              // the text object
              body: body.message,
            },
          },
          headers: { "Content-Type": "application/json" },
        });
        for (let i = 0; i < body.image.length; i++) {
          axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v12.0/" +
              phone_number_id[j] +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: recipient[j],
              type: "image",
              image: {
                link: body.image[i],
              },
            },
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      res.send({ message: "Message and Images sent" });
    } else if (body.image) {
      for (let i = 0; i < body.image.length; i++) {
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v12.0/" +
            phone_number_id[j] +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient[j],
            type: "image",
            image: {
              link: body.image[i],
            },
          },
          headers: { "Content-Type": "application/json" },
        });
      }
      res.send({ message: "Images sent" });
    } else {
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id[j] +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: recipient[j],
          type: "text",
          text: {
            // the text object
            body: body.message,
          },
        },
        headers: { "Content-Type": "application/json" },
      });
      res.send({ message: "Messagesent" });
    }
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log({ error: error });
  }
  console.log(`webhook is listening at ${PORT}`);
});
