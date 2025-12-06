import { useEffect } from "react";

function usePageTitle(title) {
  useEffect(() => {
		document.title = title;
	});
  return null;
}

export default usePageTitle;
