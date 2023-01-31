import client from "../../db";
import { getServerSession } from "next-auth";
import { fetchDomain } from "../../api";
import { authOptions } from "./auth/[...nextauth]";

export default async function updateAll(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (session.user.role !== "ADMIN") {
    res.status(401).json({ message: "You must be an admin." });
    return;
  }

  const websites = await client.website.findMany({
    select: {
      domain: true,
    },
  });

  const promises = websites.map(async (website) => {
    const { data, status } = await fetchDomain(website.domain);

    if (status !== 200) return;

    const { EstimatedMonthlyVisits } = data;

    //convert the object to an array of objects
    const viewsData = Object.entries(EstimatedMonthlyVisits).map(
      ([date, viewCount]) => ({
        date,
        viewCount: String(viewCount),
      })
    );

    return await Promise.all(
      viewsData.map(
        async ({ date, viewCount }) =>
          await client.website.update({
            where: {
              domain: website.domain,
            },
            data: {
              dataset: {
                upsert: {
                  where: {
                    date_websiteDomain: {
                      date,
                      websiteDomain: website.domain,
                    },
                  },
                  create: {
                    date,
                    viewCount,
                  },
                  update: {
                    viewCount,
                  },
                },
              },
            },
          })
      )
    );
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ message: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error" });
    });
}
