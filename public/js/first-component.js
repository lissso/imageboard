import comments from "./comment-component.js";

const firstComponent = {
    data() {
        return {
            heading: "modal component",
            image: {},
        };
    },

    props: ["image-selected"],

    mounted() {
        console.log("first component mounted");
        // console.log("accsing passingProp val:", this.passingProp);
        console.log("this.selectedImage", this.imageSelected);
        fetch(`/modal/${this.imageSelected}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("response from /modal", data);
                this.image = data;
                console.log("this.image", this.image);
            });
    },

    components: {
        comments: comments,
    },

    methods: {
        enlarge() {
            console.log("clicked");
        },

        modalAppear() {
            console.log("modal function working");
        },

        notifyParent() {
            this.$emit("close");
        },
    },

    // ideally you want your template to return one root element
    template: ` 
        <div class="overlay">
            <div @click="notifyParent" class="close-button">x</div>
                <div class="modal">
                        <div class="wrapper-modal">
                            <img v-if="image.url" :src=image.url class="enlarge">
                            <div v-else="!image.url">
                                <h2 style="color:khaki">image not found</h2>
                                <div style="background-color:white; padding: 1px 10px"></div>
                                <h1 style="color:khaki">☹︎</h1>
                            </div>
                            <div v-if="image.url" class="text-container">
                                <h2 class="modal-tile">{{image.title}}</h2>
                                <div class="line"></div>
                                <p class="user">{{image.username}}</p>
                                <p class="description">description: {{image.description}}</p>
                            </div>
                            
                        </div>
                        <comments v-if="image.url" v-bind:image-selected="imageSelected"></comments>

                    </div>
                </div>`,
};

export default firstComponent;
