const comments = {
    data() {
        return {
            heading: "comments component",
            comments: [],
            comment: "",
            username: "",
        };
    },

    props: ["image-selected"],

    // thats why in the following image-selected wird zu imageSelected
    // siehe html name links rechts

    mounted() {
        console.log("comment component mounted");

        fetch(`/comments/${this.imageSelected}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("data in  comment c", data);
                this.comments = data;
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    },

    methods: {
        submit() {
            fetch(`/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: this.comment,
                    username: this.username,
                    image_id: this.imageSelected,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    this.comments.push(data.payload);
                })
                .catch((err) => {
                    console.log("error is in fetch comment ", err);
                });
        },
    },

    template: `
    <div class="comments-template">
        <div class="comment-input">
            <input class="input-modal" v-model="comment" name="comment" placeholder="What do you think?" required/>
            <input class="input-modal" v-model="username" name="username" placeholder="Your name" required/>
            <button class="modal" @click="submit">Submit</button>
        </div>

        <div class="comments-display">
            <div class="comment-box" v-if="comments.length" v-for="comment in comments" :key="comment.id">
                <p><strong>{{comment.username}}</strong> on {{comment.created_at }}</p>
                <p>{{comment.comment}}</p>      
            </div>
        </div>  
    </div>                          
                                `,
};

export default comments;
