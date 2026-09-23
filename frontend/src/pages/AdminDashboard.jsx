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

function AdminDashboard() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // LOAD ADMIN DATA
  // ===============================
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);

    if (userData.user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/requests"
        );

        setRequests(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to fetch service requests"
        );
      }
    };

    const fetchStaffUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/staff"
        );

        setStaffUsers(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to fetch staff users"
        );
      }
    };

    const loadData = async () => {
      await Promise.all([
        fetchRequests(),
        fetchStaffUsers(),
      ]);

      setLoading(false);
    };

    loadData();
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
  // ASSIGN STAFF
  // ===============================
  const assignStaff = async (requestId, staffId) => {
    try {
      setError("");

      if (!staffId) {
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/admin/requests/${requestId}/staff`,
        {
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
          "Failed to assign staff"
      );
    }
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
  const updateStatus = async (requestId, newStatus) => {
    try {
      setError("");

      const response = await axios.put(
        `http://localhost:5000/api/admin/requests/${requestId}/status`,
        {
          status: newStatus,
        }
      );

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: response.data.request.status,
              }
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

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>👨‍💼 Admin Dashboard</h2>

          <p className="text-muted mb-0">
            Manage campus service requests
          </p>
        </div>

        <Button
          variant="danger"
          onClick={logoutHandler}
        >
          Logout
        </Button>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" />

          <p className="mt-2">
            Loading requests...
          </p>
        </div>
      )}

      {/* ================= NO REQUESTS ================= */}
      {!loading &&
        !error &&
        requests.length === 0 && (
          <Alert variant="info">
            No service requests found.
          </Alert>
        )}

      {/* ================= REQUEST LIST ================= */}
      {!loading &&
        requests.map((request) => (
          <Card
            className="shadow mb-4"
            key={request._id}
          >
            <Card.Body>

              {/* ================= TITLE + STATUS ================= */}
              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <h5>
                    {request.title}
                  </h5>

                  <p className="text-muted mb-2">
                    Student:{" "}
                    <strong>
                      {request.student?.name ||
                        "Unknown"}
                    </strong>
                  </p>
                </div>

                <Badge
                  bg={getStatusVariant(
                    request.status
                  )}
                >
                  {request.status}
                </Badge>

              </div>

              <hr />

              {/* ================= DESCRIPTION ================= */}
              <p>
                <strong>
                  Description:
                </strong>{" "}
                {request.description}
              </p>

              {/* ================= CATEGORY ================= */}
              <p className="mb-1">
                <strong>
                  Category:
                </strong>{" "}
                {request.category}
              </p>

              {/* ================= LOCATION ================= */}
              <p className="mb-1">
                <strong>
                  Location:
                </strong>{" "}
                {request.location}
              </p>

              {/* ================= STUDENT EMAIL ================= */}
              <p className="mb-1">
                <strong>
                  Student Email:
                </strong>{" "}
                {request.student?.email ||
                  "N/A"}
              </p>

              {/* ================= PRIORITY ================= */}
              <p className="mb-1">
                <strong>
                  Priority:
                </strong>{" "}

                <Badge
                  bg={getPriorityVariant(
                    request.priority
                  )}
                >
                  {request.priority}
                </Badge>
              </p>

              {/* ================= CREATED DATE ================= */}
              <p className="text-muted mb-3">
                <strong>
                  Created:
                </strong>{" "}
                {new Date(
                  request.createdAt
                ).toLocaleString()}
              </p>

              <hr />

              {/* ================= ASSIGN STAFF ================= */}
              <Form.Group className="mb-3">

                <Form.Label>
                  <strong>
                    Assign Staff
                  </strong>
                </Form.Label>

                <Form.Select
                  value={
                    request.assigned_staff?._id ||
                    ""
                  }
                  onChange={(e) =>
                    assignStaff(
                      request._id,
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Staff
                  </option>

                  {staffUsers.map((staff) => (
                    <option
                      key={staff._id}
                      value={staff._id}
                    >
                      {staff.name} -{" "}
                      {staff.email}
                    </option>
                  ))}
                </Form.Select>

                {/* CURRENT ASSIGNED STAFF */}
                {request.assigned_staff && (
                  <div className="mt-2">
                    <small className="text-success">
                      Assigned to:{" "}
                      <strong>
                        {
                          request.assigned_staff
                            .name
                        }
                      </strong>
                    </small>
                  </div>
                )}

              </Form.Group>

              {/* ================= UPDATE STATUS ================= */}
              <Form.Group>

                <Form.Label>
                  <strong>
                    Update Status
                  </strong>
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

      {/* ================= BACK BUTTON ================= */}
      <Button
        variant="secondary"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        ← Back to Dashboard
      </Button>

    </Container>
  );
}

export default AdminDashboard;