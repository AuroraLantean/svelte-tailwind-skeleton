import type { PageLoad } from "./$types";

export const load = (() => {
    // you can get this data from ANY SOURCE
    // fetch call here
    // graphql client
    // manually change this object here whenever you want

    return {
        items: [
            {
				title: "Lamborghini",
				category: "car",
				description: `supercharged 5.4-liter V-8 doling out 550 horsepower, $156,945 USD`,
				favorite: false, 
        editing: false, checked: false
			},
			{
				title: "FARIBANAV",
				category: "yacht",
				description: `Delivered in 1998 by world-renowned Amels, the 178’ (54.40m) luxury superyacht FARIBANA V is a truly unique superyacht with a Gross Tonnage of 836GT. ;$17,950,000 USD`,
				favorite: false, 
        editing: false, checked: false
			},
			{
				title: "2022 CESSNA CITATION LATITUDE",
				category: "airplane",
				description: `Textron Aviation is pleased to present this 2022 Citation Latitude on behalf of the aircraft owner.$43,183,500`,
				favorite: false, 
        editing: false, checked: false
			}
        ]
    }
}) satisfies PageLoad; //to become PageData in +page.svelte