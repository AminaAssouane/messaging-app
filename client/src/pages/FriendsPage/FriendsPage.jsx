import { useNavigate } from "react-router-dom";
import FriendSearch from "../../components/FriendSearch/FriendSearch";
import FriendRequests from "../../components/FriendRequests/FriendRequests";
import FriendsList from "../../components/FriendsList/FriendsList";

export default function FriendsPage() {
  const navigate = useNavigate();

  function handleAccepted(conversationId) {
    navigate(`/chat/${conversationId}`);
  }

  return (
    <div className="friends-page">
      <h2>Friends</h2>
      <FriendSearch />
      <hr />
      <FriendRequests onAccepted={handleAccepted} />
      <hr />
      <FriendsList />
    </div>
  );
}
