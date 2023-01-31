import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import client from "../../db";
import { fetchDomain } from "../../api";

export default async function add(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (session.user.role !== "ADMIN") {
    res.status(401).json({ message: "You must be an admin." });
    return;
  }

  const { domain, name } = req.body;

  const domainRegex = new RegExp(
    /^(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?$/i
  );

  if (!domainRegex.test(domain)) {
    res.status(400).json({ message: "Invalid domain name." });
    return;
  }

  const { data, status } = await fetchDomain(domain);

  if (status === 204) {
    res.status(400).json({
      message: "no data found for this domain! maybe the domain is invalid.",
    });
    return;
  }

  const { EstimatedMonthlyVisits } = data;

  //convert the object to an array of objects
  const viewsData = Object.entries(EstimatedMonthlyVisits).map(
    ([date, viewCount]) => ({
      date,
      viewCount: String(viewCount),
    })
  );

  client.website
    .create({
      data: {
        domain,
        name,
        dataset: {
          createMany: {
            data: viewsData,
          },
        },
      },
    })
    .then(() => {
      res.status(200).json({ message: "success" });
    })
    .catch((e) => {
      console.error(e);

      if (e.code === "P2002") {
        res.status(400).json({ message: "domain already exists" });
        return;
      }

      res.status(500).json({
        message: "there was a problem adding the data to the database",
      });
    });
}
