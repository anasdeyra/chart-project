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

  return res.status(200).json(data);
}
