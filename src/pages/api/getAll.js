import client from "../../db";

export default async function getAll(_req, res) {
  const data = await client.website.findMany({
    select: {
      domain: true,
      name: true,
      dataset: {
        select: {
          date: true,
          viewCount: true,
        },
      },
    },
  });

  //sort the data by date
  const orderedData = data.map((website) => {
    return {
      ...website,
      dataset: website.dataset.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      }),
    };
  });

  return res.status(200).json(orderedData);
}
