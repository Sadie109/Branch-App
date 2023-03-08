import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Channel, ChannelList } from "stream-chat-react";
import "@stream-io/stream-chat-css/dist/css/index.css";
import Auth from "./components/Auth.js";
import MessagingContainer from "./components/MessagingContainer.js";
import Video from "./components/Video.js"

const filters = { type: "messaging" };
const options = { state: true, presence: true, limit: 10 };
const sort = { last_message_at: -1 };

const App = () => {
  const [client, setClient] = useState(false);
  const [channel, setChannel] = useState(null);

  const authToken = false;

  useEffect(() => {
    const setupClient = async () => {
      const newClient = new StreamChat("bhz23f4j7esm");

      const handleConnectionChange = ({ online = false }) => {
        if (!online) return console.log("connection lost");
        setClient(newClient);
      };

      newClient.on("connection.changed", handleConnectionChange);

      await newClient.connectUser(
        {
          id: "dave-matthews",
          name: "Dave Matthews",
        },
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGF2ZS1tYXR0aGV3cyJ9.S1-S5zmpaDRZ18ON5WnA6777hrMyh9JuiA7bkH1uCoQ"
      );

      const channel = client.channel("gaming", "Branch", {
        name: "Branch",
      });

      await channel.create();

      return () => {
        newClient.off("connection.changed", handleConnectionChange);
        newClient.disconnectUser().then(() => console.log("connection closed"));
      };
    };
    setupClient();
    setChannel();
  }, []);

  if (!client) return null;

  return (
    <>
      {!authToken && <Auth/>}
      {authToken && (
        <Chat client={client} darkMode={true}>
          <ChannelList filters={filters} sort={sort} options={options} />
          <Channel channel={channel}>
          <Video/>
            <MessagingContainer />
          </Channel>
        </Chat>
      )}
    </>
  );
};

export default App;
