import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // LOAD STAFF REQUESTS
  // ===============================
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    const user = userData?.user;

    // Check staff role
    if (user?.role !== "staff") {
      navigate("/dashboard");
      return;
    }

    const fetchAssignedRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/staff/requests/${user.id}`
        );

        setRequests(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to fetch assigned requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedRequests();
  }, [navigate]);

  // ===============================
  // STATUS BADGE
  // ===============================
  const getStatusVariant = (status) => {
    if (status === "Pending") return "warning";
    if (status === "In Progress") return "primary";
    if (status === "Resolved") return "success";

    return "secondary";
  };

  // ===============================
  // PRIORITY BADGE
  // ===============================
  const getPriorityVariant = (priority) => {
    if (priority === "High") return "danger";
    if (priority === "Medium") return "warning";
    if (priority === "Low") return "success";

    return "secondary";
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
  const updateStatus = async (requestId, newStatus) => {
    try {
      setError("");

      const storedUser = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const staffId = storedUser?.user?.id;

      const response = await axios.put(
        `http://localhost:5000/api/staff/requests/${requestId}/status`,
        {
          status: newStatus,
          staffId: staffId,
        }
      );

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === requestId
            ? response.data.request
            : request
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update request status"
      );
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // ===============================
  // UI
  // ===============================
  return (
    <Container className="py-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>🛠️ Staff Dashboard</h2>

          <p className="text-muted mb-0">
            Manage your assigned campus service requests
          </p>
        </div>

        <Button
          variant="danger"
          onClick={logoutHandler}
        >
          Logout
        </Button>
      </div>

      {/* ERROR */}
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" />

          <p className="mt-2">
            Loading assigned requests...
          </p>
        </div>
      )}

      {/* NO REQUESTS */}
      {!loading &&
        !error &&
        requests.length === 0 && (
          <Alert variant="info">
            No requests have been assigned to you yet.
          </Alert>
        )}

      {/* REQUEST LIST */}
      {!loading &&
        requests.map((request) => (
          <Card
            className="shadow mb-4"
            key={request._id}
          >
            <Card.Body>

              {/* TITLE + STATUS */}
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5>{request.title}</h5>

                  <p className="text-muted mb-2">
                    Student:{" "}
                    <strong>
                      {request.student?.name || "Unknown"}
                    </strong>
                  </p>
                </div>

                <Badge
                  bg={getStatusVariant(request.status)}
                >
                  {request.status}
                </Badge>
              </div>

              <hr />

              {/* DESCRIPTION */}
              <p>
                <strong>Description:</strong>{" "}
                {request.description}
              </p>

              {/* CATEGORY */}
              <p className="mb-1">
                <strong>Category:</strong>{" "}
                {request.category}
              </p>

              {/* LOCATION */}
              <p className="mb-1">
                <strong>Location:</strong>{" "}
                {request.location}
              </p>

              {/* STUDENT EMAIL */}
              <p className="mb-1">
                <strong>Student Email:</strong>{" "}
                {request.student?.email || "N/A"}
              </p>

              {/* PRIORITY */}
              <p className="mb-3">
                <strong>Priority:</strong>{" "}

                <Badge
                  bg={getPriorityVariant(request.priority)}
                >
                  {request.priority}
                </Badge>
              </p>

              <hr />

              {/* UPDATE STATUS */}
              <Form.Group>
                <Form.Label>
                  <strong>Update Request Status</strong>
                </Form.Label>

                <Form.Select
                  value={request.status}
                  onChange={(e) =>
                    updateStatus(
                      request._id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </Form.Select>
              </Form.Group>

            </Card.Body>
          </Card>
        ))}

      {/* BACK BUTTON */}
      <Button
        variant="secondary"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </Button>

    </Container>
  );
}

export default StaffDashboard;