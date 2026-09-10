export default function Loading({ text = "Loading..." }) {
  return (
    <div className="py-5 text-center">
      <div className="spinner-border text-primary" role="status" />
      <div className="mt-2 text-secondary">{text}</div>
    </div>
  );
}
