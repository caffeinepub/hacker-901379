# Hacker.901379

## Current State
New project. Empty backend and default frontend scaffold.

## Requested Changes (Diff)

### Add
- Public media sharing platform (no login required)
- Upload page: anyone can upload video, photo, or audio files
- Gallery/feed page: display all uploaded media in a grid
- Each media card shows filename, type icon, upload date, and a Download button
- Filter bar to filter by media type (All, Photos, Videos, Audio)
- File type and size validation on upload
- Backend stores media blobs via blob-storage component
- Backend tracks metadata: filename, media type, upload timestamp, file size, blob reference

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Select blob-storage component
2. Generate Motoko backend with:
   - uploadMedia(filename, mediaType, data) -> async Result
   - listMedia() -> async [MediaMetadata]
   - getMedia(id) -> async ?Blob
   - deleteMedia(id) -> async Result (admin future use)
3. Frontend:
   - App with two views: Gallery and Upload
   - Gallery: grid of media cards with preview (image/video/audio), filename, date, download button
   - Upload: drag-and-drop or file picker, progress indicator, success/error feedback
   - Filter tabs: All / Photos / Videos / Audio
