import { useState } from "react";
import axios from "axios";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreateRequest() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Electrical",
    location: "",
    priority: "Medium",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/requests",
        {
          student: userInfo.user.id,
          ...formData,
        }
      );

      setMessage(response.data.message);

      setFormData({
        title: "",
        description: "",
        category: "Electrical",
        location: "",
        priority: "Medium",
      });

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create service request"
      );
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow p-4 mx-auto" style={{ maxWidth: "700px" }}>
        <h2 className="text-center mb-4">
          Create Service Request
        </h2>

        {message && <Alert variant="success">{message}</Alert>}

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          
          {/* Title */}
          <Form.Group className="mb-3">
            <Form.Label>Request Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Example: Classroom fan not working"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              placeholder="Describe the problem..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Category */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>

            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Electrical">Electrical</option>
              <option value="Water">Water</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Classroom">Classroom</option>
              <option value="Lab">Lab</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          {/* Location */}
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>

            <Form.Control
              type="text"
              name="location"
              placeholder="Example: Flour - Room 22"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Priority */}
          <Form.Group className="mb-4">
            <Form.Label>Priority</Form.Label>

            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="primary"
              type="submit"
              className="w-100"
            >
              Submit Request
            </Button>

            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Back
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default CreateRequest;