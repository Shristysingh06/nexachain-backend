import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";


function Charts() {


  const data = [
    {
      name: "Jan",
      investment: 1000,
      roi: 100,
      income: 50
    },
    {
      name: "Feb",
      investment: 3000,
      roi: 300,
      income: 150
    },
    {
      name: "Mar",
      investment: 5000,
      roi: 500,
      income: 250
    },
    {
      name: "Apr",
      investment: 7000,
      roi: 700,
      income: 400
    }
  ];



  return (

    <div>

      <h2>Investment & ROI Chart</h2>


      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="investment"
          />

          <Line
            type="monotone"
            dataKey="roi"
          />

        </LineChart>


      </ResponsiveContainer>





      <h2>Income Chart</h2>


      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data}>

          <CartesianGrid />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="income" />

        </BarChart>


      </ResponsiveContainer>


    </div>

  );

}


export default Charts;