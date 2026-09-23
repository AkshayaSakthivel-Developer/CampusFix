import { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData.user);
  }, [navigate]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Campus Service Request Management System</h2>

        <Button variant="danger" onClick={logoutHandler}>
          Logout
        </Button>
      </div>

      <Card className="shadow mb-4">
        <Card.Body>
          <h4>Welcome, {user.name}! 👋</h4>

          <p className="mb-1">
            Email: {user.email}
          </p>

          <p className="mb-0">
            Role: <strong>{user.role}</strong>
          </p>
        </Card.Body>
      </Card>

      {user.role === "student" && (
        <Row>
          <Col md={6}>
            <Card className="shadow">
              <Card.Body>
                <h5>📝 Create Service Request</h5>
                <p>
                  Report a campus issue such as electrical,
                  water, cleaning, classroom or lab problems.
                </p>

                <Button
  variant="primary"
  onClick={() => navigate("/create-request")}
>
  Create Request
</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow">
              <Card.Body>
                <h5>📋 My Requests</h5>
                <p>
                  View and track the status of your requests.
                </p>

                <Button
  variant="secondary"
  onClick={() => navigate("/my-requests")}
>
  View Requests
</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {user.role === "staff" && (
        <Card className="shadow">
          <Card.Body>
            <h4>🔧 Staff Dashboard</h4>
            <p>
              View assigned service requests and update their
              progress.
            </p>

            <Button
  variant="primary"
  onClick={() => navigate("/staff-dashboard")}
>
  View Assigned Requests
</Button>
          </Card.Body>
        </Card>
      )}

      {user.role === "admin" && (
        <Card className="shadow">
          <Card.Body>
            <h4>👨‍💼 Admin Dashboard</h4>
            <p>
              Manage campus service requests, staff and priorities.
            </p>

            <Button
  variant="primary"
  onClick={() => navigate("/admin-dashboard")}
>
  Manage Requests
</Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Dashboard;