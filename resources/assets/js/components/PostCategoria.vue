<template>
    <div class="container">
        <form @submit.prevent="submit" @keydown="form.errors.clear($event.target.name)" class="form-horizontal">
            <alert-error :form="form"></alert-error>

            <div class="form-group" :class="{ 'has-error': form.errors.has('descricao') }">
                <label for="descricao" class="col-md-3 control-label">Descrição: </label>
                <div class="col-md-6">
                    <input v-model="form.descricao" type="descricao" name="descricao" id="descricao"
                           class="form-control">
                    <has-error :form="form" field="descricao"></has-error>
                </div>
            </div>

            <div class="form-group">
                <button :disabled="form.busy" type="submit" class="btn btn-primary" name="enviar">Enviar</button>
            </div>
        </form>
    </div>
</template>

<script>
    import {Form, HasError, AlertError} from 'vform'
    export default {
        data () {
            return {
                // Create a new form instance
                form: new Form({
                    descricao: '',
                })
            }
        },
        props: ['id', 'descricao'],
        mounted() {
            console.log(window.location.href);
            this.form.descricao = this.descricao;
        },
        methods: {
            submit () {
                // Submit the form via a POST request
                var location = window.location.href;
                if (location.indexOf("edit") > -1) {
                    this.form.put('/admin/post-categorias/update/'+ this.id)
                        .then(({data}) => {
                            window.location.href = '/admin/post-categorias'
                        })
                } else {
                    this.form.post('/admin/post-categorias/')
                        .then(({data}) => {
                            window.location.href = '/admin/post-categorias'
                        })
                }

            },
        }

    };
</script>
