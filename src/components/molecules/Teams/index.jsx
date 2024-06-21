import Farhan from "@assets/teams/Farhan.webp";
import Renaldy from "@assets/teams/Renaldy.webp";
import Hesti from "@assets/teams/Hesti.webp";
import Hanifah from "@assets/teams/Hanifah.webp";
import Dapa from "@assets/teams/Dapa.webp";

const teamMembers = [
  {
    name: "Ahmad Farhan K",
    role: "Frontend Developer",
    university: "Universitas Proklamasi 45 Yogyakarta",
    image: Farhan,
  },
  {
    name: "Renaldy Baleano Y",
    role: "Designer UI/UX",
    university: "Universitas Suryakancana",
    image: Renaldy,
  },
  {
    name: "Hesti Lusiati",
    role: "Project Manager",
    university: "STMIK Widya Utama",
    image: Hesti,
  },
  {
    name: "Hanifah Eka C",
    role: "QA (Quality Assurance)",
    university: "Universitas Muhammadiyah Surakarta",
    image: Hanifah,
  },
  {
    name: "Moch Dapa Adhari",
    role: "Frontend Developer",
    university: "Universitas Muhammadiyah Prof Dr Hamka",
    image: Dapa,
  },
];

const Team = () => {
  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
        Tim Kami
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="card w-full rounded-lg bg-white shadow-lg transform transition-transform duration-500 hover:scale-105"
          >
            <figure className="flex justify-center pt-8">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
              />
            </figure>
            <div className="card-body text-center ">
              <h3 className="card-title text-xl justify-center font-bold mb-2 text-gray-800">
                {member.name}
              </h3>
              <p className="text-gray-600 mb-1">{member.role}</p>
              <p className="text-gray-500 italic text-sm">
                {member.university}
              </p>
            </div>
            <div className="card-footer bg-gray-50 p-4 text-center">
              <button className="text-primary-600 hover:text-primary-800 font-semibold">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
