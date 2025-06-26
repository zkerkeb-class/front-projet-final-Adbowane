import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", participants: 30 },
  { name: "Feb", participants: 45 },
  { name: "Mar", participants: 60 },
];

const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-md rounded">
        <p className="font-bold">{label}</p>
        <p>{`Participants: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ActivityChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="participants" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;
