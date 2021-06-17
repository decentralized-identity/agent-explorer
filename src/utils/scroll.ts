export const scrollMessages = (smooth?: boolean) => {
  console.log(document.getElementById('chat-window')?.scrollHeight)

  document.getElementById('chat-window')?.scrollTo({
    top: document.getElementById('chat-window')?.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  })
}
