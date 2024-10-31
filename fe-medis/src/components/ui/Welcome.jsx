import React from "react";
import { useSelector } from "react-redux";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-sm">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {/* Dashboard Title */}
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>

          {/* Welcome Message */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg text-gray-600">
            <span>Welcome back,</span>
            <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {user && user.name}
            </span>
          </div>

          {/* Optional Decorative Element */}
          <div className="pt-6">
            <div className="h-1.5 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
          </div>

          {/* Quick Stats or Info Cards - Optional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-sm font-medium text-gray-500">
                Today's Date
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-sm font-medium text-gray-500">User Role</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {user && user.role}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-sm font-medium text-gray-500">
                Last Login
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
