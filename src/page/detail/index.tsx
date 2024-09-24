import { useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import { User } from "../../types/user";

function Details() {
  const { id } = useParams();
  const [detail, setDetail] = useState<User | null>(null); // Single user object
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await api.get(`users/${id}`);
        setDetail(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDetails();
  }, [id]);

  if (!detail) return <div>Loading...</div>; // Show loading state until data is fetched

  return (
    <div className="details-container">
      <div className="details-card">
        <p><strong>First Name:</strong> {detail.first_name}</p>
        <p><strong>Last Name:</strong> {detail.last_name}</p>
        <p><strong>Email:</strong> {detail.email}</p>
        <img src={`${detail.avatar}`} alt="avatar" className="avatar-image"/>
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default Details;
