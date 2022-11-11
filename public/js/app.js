import * as Vue from "./vue.js";
import firstComponent from "./first-component.js";
// all logs are clientside look at the server page

//its gonna treat the main container in the html like a template
Vue.createApp({
    data() {
        return {
            images: [],
            user: "",
            title: "",
            image: null,
            file: "",
            selectedImage: "",
            visible: true,
            description: "",
            comments: [],
            moreButton: true,
        };
    }, //data ends

    // here you have your mounted function
    // when you add a new component, you need to register it :)
    components: {
        "first-component": firstComponent,
    },

    //runs always automatically but it only runs ones, its the first thing to run
    mounted() {
        console.log("my vue app");
        // location to ask for any images to retrieve in our database!
        // console.log(this, "this");

        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("response from /images: ", data);
                this.images = data;
            });

        if (parseInt(location.pathname.slice(1))) {
            this.selectedImage = location.pathname.slice(1);
        } else {
            history.pushState({}, "", "/");
        }
        window.addEventListener("popstate", () => {
            this.selectedImage = location.pathname.slice(1);
        });
    },

    methods: {
        //definition of all the functions
        handleSubmit() {
            // handleSubmit(e) {
            // e.preventDefault(); oder in der form in html
            console.log("handle Submit");
            const formData = new FormData();

            formData.append("description", this.description);
            formData.append("user", this.user);
            formData.append("title", this.title);
            formData.append("file", this.file);
            // console.log(formData);

            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((result) => {
                    return result.json();
                })
                .then((data) => {
                    this.images.unshift(data.payload);
                    console.log("upload data: ", data);
                })
                .catch((err) => {
                    console.log("err in upload handleSubmit", err);
                });
        },
        handleChange(e) {
            // console.log("this is e target:", e.target.files[0]);
            this.file = e.target.files[0];
        },

        enlarge(id) {
            this.selectedImage = id;
            // /this.image;
            console.log("photo is clicked", id);
            history.pushState({}, "", `/${id}`);
            // history.pushState({}, "", "/+id");
        },

        closemodal() {
            this.selectedImage = null;
            console.log("close");
            history.pushState({}, "", "/");
        },

        getMoreImages() {
            console.log("more images");
            let smallerId = this.images[this.images.length - 1].id;

            fetch(`/moreButton/${smallerId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    this.images.push(...data.payload);
                })
                .catch((err) => {
                    console.log("error is in get mor Images ", err);
                });
        },
    },
}).mount("#main");

// Vue.createApp({
//     data() {
//         return {
//             name: "Cayenne",
//             visible: false,
//             cities: [
//                 // {
//                 //     id: 1,
//                 //     name: "Berlin",
//                 //     country: "DE",
//                 // },
//                 // {
//                 //     id: 2,
//                 //     name: "Guayaquil",
//                 //     country: "Ecuador",
//                 // },
//                 // {
//                 //     id: 3,
//                 //     name: "WAShington DC.",
//                 //     country: "USA",
//                 // },
//             ],
//         };
//     }, //data ends

//     //runs always automatically but it only runs ones, its the first thing to run
//     mounted() {
//         console.log("my vue app, here we want to ask for the images");
//         // location to ask for any images to retrieve in our database!
//         // fetch
//         console.log(this, "this");

//         fetch("/cities")
//             .then((resp) => resp.json())
//             .then((data) => {
//                 console.log("response from /cities: ", data);

//                 this.cities = data;
//             });
//     },

//     methods: {
//         //definition of all the functions

//         myFirstFunction: function (city) {
//             console.log(
//                 "First function running!!! and my city name is ===>",
//                 city
//             );
//         },
//     },
// }).mount("#main");
