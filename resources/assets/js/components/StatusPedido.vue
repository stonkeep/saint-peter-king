<template>
    <div class="container">
        <form @submit.prevent="submit" @keydown="form.errors.clear($event.target.name)" class="form-horizontal">
            <alert-error :form="form"></alert-error>

            <!--Descrição-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('descricao') }">
                <label for="descricao" class="col-md-3 control-label">Descrição: </label>
                <div class="col-md-6">
                    <input v-model="form.descricao" type="text" name="descricao" id="descricao"
                              class="form-control">
                    <has-error :form="form" field="descricao"></has-error>
                </div>
            </div>

            <!--Submit-->
            <div class="form-group">
                <button :disabled="form.busy" type="submit" class="btn btn-primary" name="enviar">Enviar</button>
            </div>

        </form>
    </div>
</template>

<script>
    import {Form, HasError, AlertError} from 'vform'

    export default {
        data() {
            return {
                // Create a new form instance
                form: new Form({
                    id: this.status.id,
                    descricao: this.status.descricao,
                })
            }
        },
        props: ['status'],
        mounted() {
            console.log('Component mounted.');
        },
        methods: {
            submit () {
                // Submit the form via a POST request
                let location = window.location.href;
                if (location.indexOf("edit") > -1) {
                    console.log(this.form.id);
                    this.form.put('/admin/statuss/'+ this.form.id)
                        .then(({data}) => {
                            window.location.href = '/admin/statuss'
                        })
                } else {
                    this.form.post('/admin/statuss')
                        .then(({data}) => {
                            window.location.href = '/admin/statuss'
                        })
                }

            },
        }
    }
</script>
