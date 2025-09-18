# # backend/analyze.py
# import os
# import cv2
# import mediapipe as mp
# import numpy as np

# def process_video(uploaded_video_path):
#     if not os.path.exists(uploaded_video_path):
#         return {"error": f"Video not found: {uploaded_video_path}"}, None

#     mp_drawing = mp.solutions.drawing_utils
#     mp_pose = mp.solutions.pose

#     cap = cv2.VideoCapture(uploaded_video_path)
#     if not cap.isOpened():
#         return {"error": f"Failed to open: {uploaded_video_path}"}, None

#     title = os.path.splitext(os.path.basename(uploaded_video_path))[0]
#     out_dir = "output"; os.makedirs(out_dir, exist_ok=True)
#     out_path = os.path.join(out_dir, f"{title}_output.mp4")

#     w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#     h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
#     if w == 0 or h == 0:
#         return {"error": "Invalid frame size"}, None

#     fourcc = cv2.VideoWriter_fourcc(*"mp4v")
#     out = cv2.VideoWriter(out_path, fourcc, 30.0, (w, h))

#     # Very barebones rep data structure
#     rep_data = {
#         "type": "video",
#         "width": w, "height": h,
#         "frames": int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),
#         "fps": float(cap.get(cv2.CAP_PROP_FPS)),
#         "reps": []  # you will push per-rep dicts here
#     }

#     with mp_pose.Pose(min_detection_confidence=0.5,
#                       min_tracking_confidence=0.5) as pose:
#         while True:
#             ok, frame = cap.read()
#             if not ok: break

#             rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#             rgb.flags.writeable = False
#             results = pose.process(rgb)

#             if results.pose_landmarks:
#                 mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
#                 # TODO: your elbow angle math + rep logic goes here.
#                 # Example of pushing a fake datapoint just to see the flow:
#                 # rep_data["reps"].append({"rep": len(rep_data["reps"])+1,
#                 #                          "left_elbow_min": 85, "right_elbow_min": 87,
#                 #                          "label": "Correct"})

#             out.write(frame)

#     cap.release(); out.release(); cv2.destroyAllWindows()
#     return rep_data, out_path
