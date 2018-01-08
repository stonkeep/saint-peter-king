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
    import {Form, HasError, AlertError, AlertErrors} from 'vform'

    export default {
        data() {
            return {
                // Create a new form instance
                form: new Form({
                    id: this.status.id,
                    descricao: this.status.descricao,
                }),
            }
        },
        props: ['status'],
        mounted() {
            console.log('Component mounted.');
        },
        methods: {
            submit () {
                // Submit the form via a PUT request
                let location = window.location.href;
                if (location.indexOf("edit") > -1) {
                    this.form.put('/admin/status/'+ this.form.id)
                        .then(({data}) => {
                            window.location.href = '/admin/status'
                        })
                        .catch((error) => {
                            this.form.errors.errors.error = error.response.data;
                        });
                } else {
                    // Submit the form via a POST request
                    this.form.post('/admin/status')
                        .then((response) => {
                            console.log(response);
                            if (this.form.successful===true && response.status===200){
                                window.location.href = '/admin/status'
                            };
                        })
                        .catch((error) => {
                            this.form.errors.errors.error = error.response.data;
                        });
                }

            },
        }
    }
</script>
