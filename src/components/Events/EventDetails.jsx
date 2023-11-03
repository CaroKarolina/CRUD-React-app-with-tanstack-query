import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchEvent, queryClient, removeEvent } from "../../util/http.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";
import Modal from "../UI/Modal.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";

export default function EventDetails() {
  const [isDeleteDiaogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });
  const {
    mutate,
    isPending: isDeletePending,
    isError: isDeleteError,
    error: errorDelete,
  } = useMutation({
    mutationFn: removeEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });
  const handleDeleteEvent = () => {
    setIsDeleteDialogOpen(true);
  };
  let content;
  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching event data....</p>
      </div>
    );
  }
  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            "Failed to fetch event data, please try agai later...."
          }
        />
      </div>
    );
  }
  if (data) {
    const formatedDate = new Date(data.date).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDeleteEvent}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formatedDate} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {isDeleteDiaogOpen && (
        <Modal>
          <h2>Are u sure ?</h2>
          <p>
            Do u really want to delete this event? Action cannot be undone.
          </p>
          <div className="form-actions">
            {isDeletePending ? (
              <LoadingIndicator />
            ) : (
              <>
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="button-text"
                >
                  Cancel
                </button>
                <button onClick={() => mutate({ id })} className="button">
                  Delete
                </button>
              </>
            )}
          </div>
          {isDeleteError && (
            <ErrorBlock
              title="Failed to delete event"
              message={
                errorDelete.info?.message ||
                "Failed to delete event, please try again later..."
              }
            />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
