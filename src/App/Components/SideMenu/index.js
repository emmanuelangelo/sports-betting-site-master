const SideMenu = ({ FaHome, FaCalculator, FaEye, FaPhone, sidebar }) => {
  // Data used to map through sidebar
  const sideMenuData = [
    { title: "Home", path: "/", icon: FaHome, cName: "sidemenu-text" },
    {
      title: "Stats",
      path: "/stats",
      icon: FaCalculator,
      cName: "sidemenu-text",
    },
    {
      title: "Insights",
      path: "/insights",
      icon: FaEye,
      cName: "sidemenu-text",
    },
    {
      title: "Contact",
      path: "/contact",
      icon: FaPhone,
      cName: "sidemenu-text",
    },
  ];

  return (
    //   Mapping through sidebar
    <div className={!sidebar ? "sidemenu-wrapper" : "sidemenu-wrapper active"}>
      {console.log(!sidebar)}
      <ul sidemenu-list>
        {sideMenuData.map((data, index) => {
          return (
            <li key={index} className={data.cName}>
              <a href={data.path}>
                {data.icon}
                <span>{data.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideMenu;
