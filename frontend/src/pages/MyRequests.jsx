import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);

    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/requests/student/${userData.user.id}`
        );

        setRequests(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to fetch requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const getStatusVariant = (status) => {
    if (status === "Pending") return "warning";
    if (status === "In Progress") return "primary";
    if (status === "Resolved") return "success";

    return "secondary";
  };

  const getPriorityVariant = (priority) => {
    if (priority === "High") return "danger";
    if (priority === "Medium") return "warning";
    if (priority === "Low") return "success";

    return "secondary";
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📋 My Requests</h2>

        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && <p>Loading requests...</p>}

      {!loading && !error && requests.length === 0 && (
        <Alert variant="info">
          You have not created any service requests yet.
        </Alert>
      )}

      {!loading &&
        !error &&
        requests.map((request) => (
          <Card className="shadow mb-3" key={request._id}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5>{request.title}</h5>

                  <p className="mb-2">
                    {request.description}
                  </p>
                </div>

                <Badge
                  bg={getStatusVariant(request.status)}
                >
                  {request.status}
                </Badge>
              </div>

              <hr />

              <p className="mb-1">
                <strong>Category:</strong> {request.category}
              </p>

              <p className="mb-1">
                <strong>Location:</strong> {request.location}
              </p>

              <p className="mb-1">
                <strong>Priority:</strong>{" "}
                <Badge bg={getPriorityVariant(request.priority)}>
                  {request.priority}
                </Badge>
              </p>

              <p className="mb-0 text-muted">
                <strong>Created:</strong>{" "}
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </Card.Body>
          </Card>
        ))}
    </Container>
  );
}

export default MyRequests;