interface VideoTimelineDataRootObject {
  activities: Activity[];
  code: string;
  impressionId: string;
  nextCursor: string;
}

interface Activity {
  sensitive: boolean;
  message: Message;
  thumbnailUrl: string;
  label: Message;
  content: ActivityContent;
  id: string;
  kind: string;
  createdAt: string;
  actor: Actor;
}

interface Actor {
  id: string;
  type: string;
  name: string;
  iconUrl: string;
  url: string;
  isLive: boolean;
}

interface ActivityContent {
  type: string;
  id: string;
  title: string;
  url: string;
  startedAt: string;
  video: Video;
}

interface Video {
  duration: number;
  playbackPosition?: number;
}

interface Message {
  text: string;
}