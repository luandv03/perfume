import { Line } from "react-chartjs-2";
import { Text } from "@mantine/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LineChart = ({ chartData }: { chartData: any }) => {
    return (
        <div className="chart-container">
            <Text sx={{ textAlign: "center" }} size="xl" fw={500}>
                2023 Year Revenue History
            </Text>
            <Line
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            // text: "Users Gained between 2016-2020",
                        },
                        legend: {
                            display: false,
                        },
                    },
                }}
            />
        </div>
    );
};
