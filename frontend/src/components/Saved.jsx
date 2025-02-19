import useGetSaved from "@/hooks/useGetSaved";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import blankprofilepic from "../assets/blankprofilepic.png";

const Saved = () => {
  useGetSaved();
  const { userSavedPost } = useSelector((store) => store.auth);

  return (
    <div className="max-w-4xl mx-auto p-6 cursor-pointer">
      <h2 className="text-2xl font-semibold mb-6">Saved Posts</h2>
      {userSavedPost && userSavedPost.length > 0 ? (
        <div className="grid gap-6">
          {userSavedPost.map((savedpost) => (
            <div
              key={savedpost._id}
              className="flex items-start border rounded-lg p-4 shadow-md bg-white"
            >
              {savedpost?.image ? (
                <img
                  className="w-40 h-40 object-cover rounded-lg"
                  src={savedpost.image}
                  alt="Saved Post"
                />
              ) : (
                <img
                  className="w-40 h-40 object-cover rounded-lg"
                  src={blankprofilepic}
                  alt="Saved Post"
                />
              )}
              <div className="ml-6 flex flex-col justify-between">
                <div className="flex items-center gap-3 mt-4">
                  <Avatar>
                    <AvatarImage src={savedpost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-600">
                    @{savedpost?.author?.username}
                  </span>
                </div>
                <span className="text-lg font-medium">{savedpost.caption}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <p className="text-lg font-medium">
            You haven't saved any posts yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Saved;
