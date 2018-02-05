var vm = new Vue({
    el: ".app",
    data: {
        arr: [
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: true
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            },
            {
                photo: "./default/img3.jpg",
                name: "450ml柔顺丰盈护发素正品",
                num: 1,
                price: 78.00,
                core: 78,
                off: false
            }
        ],
        all: false,
        marey: 0,
        all_marey:0
    },
    methods: {
        check: function (index) {
            this.arr[index].off = !this.arr[index].off;
            for (var i in this.arr) {
                this.all = true;
                if (!this.arr[i].off) {
                    this.all = false;
                    break;
                }
            }
            this.addall();
        },
        close: function (index) {
            this.arr.splice(index, 1);
            for (var i in this.arr) {
                this.all = true;
                if (!this.arr[i].off) {
                    this.all = false;
                    break;
                }
            }
            this.addall();
        },
        jian: function (index) {
            if (this.arr[index].num != 1) {
                this.arr[index].num--;

                this.addall();
            }

        },
        add: function (index) {
            this.arr[index].num++;
            this.arr[index].off = false;
            this.check(index);
            this.addall();

        },
        addall: function () {
            var mroe = 0;
            for (var i in this.arr) {
                if (this.arr[i].off) {
                    mroe += this.arr[i].price * this.arr[i].num;
                }
            }
            this.all_marey = mroe;
        },
        check_all: function () {
            this.all = !this.all;
            for (var i in this.arr) {
                this.arr[i].off = this.all;
            }
            this.addall();
        }
    },
    created: function () {
        this.addall();
    }
})