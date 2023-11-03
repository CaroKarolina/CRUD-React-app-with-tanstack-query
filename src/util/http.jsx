import { QueryClient } from "@tanstack/react-query";

let apiURL = "http://localhost:3000/events";

export const queryClient = new QueryClient();

export const fetchEvents = async ({ signal, searchTerm, max }) => {
  console.log(signal);
  let url = "http://localhost:3000/events";

  if (searchTerm && max) {
    url += "?search=" + searchTerm + "&max=" + max;
  } else if (searchTerm) {
    url += "?search=" + searchTerm;
  } else if (max) {
    url += "?max=" + max;
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
};

export const createNewEvent = async (eventData) => {
  const response = await fetch(apiURL, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();
  console.log(event);
  return event;
};

export const fetchSelectableImg = async ({ signal }) => {
  const res = await fetch(`${apiURL}/images`, { signal });

  if (!res.ok) {
    const error = new Error("An error occured while fetching images");
    error.code = res.status;
    error.info = await res.json();
    throw error;
  }

  const { images } = await res.json();
  return images;
};

export const fetchEvent = async ({ signal, id }) => {
  console.log(id);
  const res = await fetch(`${apiURL}/${id}`, { signal: signal });
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the event");
    error.code = res.status;
    error.info = await res.json();
    throw error;
  }

  const { event } = await res.json();
  return event;
};

export const removeEvent = async ({ id }) => {
  const res = await fetch(`${apiURL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const error = new Error("");
    error.code = res.status;
    error.info = await res.json();
    throw error;
  }
  return res.json();
};

export const updateEvent = async ({ id, event }) => {
  const res = await fetch(`${apiURL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ event }),
    headers: { "Content-Type": "application/JSON" },
  });
  if (!res.ok) {
    const error = new Error("");
    error.code = res.status;
    error.info = await res.json();
    throw error;
  }
  return res.json();
};
