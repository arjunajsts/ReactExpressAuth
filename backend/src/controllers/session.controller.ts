import { NOT_FOUND, OK } from "@/constants/http.js";
import { SessionModel } from "@/models/session.model.js";
import { appAssert } from "@/utils/appAssert.js";
import catchErrors from "@/utils/catchError.js";
import { clearAuthCookies } from "@/utils/cookies.js";
import { z } from "zod";

// Use the SessionDocument interface to explicitly type the session in the result
export const getSessionsHandler = catchErrors(async (req, res) => {
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    }
  )
    .lean()
    .sort({ createdAt: -1 });

  res.status(OK).json(
    sessions.map((session) => {
      const sessionIdString = session._id.toString();
      const isCurrent = sessionIdString === req.sessionId?.toString();

      return {
        ...session,
        ...(isCurrent && { isCurrent: true }),
      };
    })
  );
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().min(1).max(24).parse(req.params.id);
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, "Session not found");
 
  res.status(OK).json({
    message: "Session removed",
  });
});
