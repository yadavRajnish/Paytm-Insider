import express from "express";
import {
  addEvent,
  deleteEvent,
  getEvent,
  getEventData,
  getEvents,
  getEventsByEventId,
  getEventsById,
  getEventsByQuery,
  getEventsTag,
  softDeleteEvent,
  updateEvent,
} from "../Controller/event.controller";

const router = express.Router();

router.get("/get-event/:_id", getEvent);
router.get("/get-event-by-id/:categoryId", getEventsById);
router.get("/get-event-by-eventid/:_id", getEventsByEventId);
router.get("/get-events", getEvents);
router.get("/get-event-data", getEventData);
router.get("/get-event-tag", getEventsTag);
router.get("/get-event-categoryid", getEventsByQuery);
router.post("/add-event", addEvent);
router.put("/update-event/:_id", updateEvent);
router.delete("/soft-delete-event/:_id", softDeleteEvent);
router.delete("/delete-event/:_id", deleteEvent);

export default router;
