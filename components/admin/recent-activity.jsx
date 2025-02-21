export function RecentActivity() {
  const activities = [
    {
      id: 1,
      action: "New image uploaded",
      time: "2 minutes ago",
    },
    {
      id: 2,
      action: "Team member profile updated",
      time: "1 hour ago",
    },
    {
      id: 3,
      action: "New testimonial added",
      time: "3 hours ago",
    },
    {
      id: 4,
      action: "Gallery section updated",
      time: "5 hours ago",
    },
    {
      id: 5,
      action: "Contact form submission",
      time: "1 day ago",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex justify-between items-center">
          <p className="text-sm">{activity.action}</p>
          <p className="text-sm text-gray-500">{activity.time}</p>
        </div>
      ))}
    </div>
  )
}

