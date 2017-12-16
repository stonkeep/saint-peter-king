<template>
    <div class="container">
        <form @submit.prevent="submit" @keydown="form.errors.clear($event.target.name)" class="form-horizontal">
            <alert-error :form="form"></alert-error>

            <!--Nome-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('nome') }">
                <label for="nome" class="col-md-3 control-label">Nome: </label>
                <div class="col-md-6">
                    <input v-model="form.nome" type="text" name="nome" id="nome"
                           class="form-control">
                    <has-error :form="form" field="descricao"></has-error>
                </div>
            </div>
            <!--Descrição-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('descricao') }">
                <label for="descricao" class="col-md-3 control-label">Descrição: </label>
                <div class="col-md-6">
                    <textarea v-model="form.descricao" type="text" name="descricao" id="descricao"
                           class="form-control">
                    </textarea>
                    <has-error :form="form" field="descricao"></has-error>
                </div>
            </div>

            <!--Peso Unitário-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('peso_unitario') }">
                <label for="peso_unitario" class="col-md-3 control-label">Peso Unitário: </label>
                <div class="col-md-6">
                    <input v-model="form.peso_unitario" type="number" name="peso_unitario" id="peso_unitario"
                              class="form-control">
                    <has-error :form="form" field="peso_unitario"></has-error>
                </div>
            </div>

            <!--Preço Unitário-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('preco_unitario') }">
                <label for="preco_unitario" class="col-md-3 control-label">Preço Unitário: </label>
                <div class="col-md-6">
                    <input v-model="form.preco_unitario" type="number" name="preco_unitario" id="preco_unitario"
                           class="form-control">
                    <has-error :form="form" field="preco_unitario"></has-error>
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
                    descricao: this.descricao,
                    nome: this.nome,
                    peso_unitario: this.peso_unitario,
                    preco_unitario: this.preco_unitario,
                })
            }
        },
        methods: {
            submit () {
                // Submit the form via a POST request
                let location = window.location.href;
                if (location.indexOf("edit") > -1) {
                    console.log(this.form.id);
                    this.form.put('/admin/produtos/update/'+ this.form.id)
                        .then(({data}) => {
                            window.location.href = '/admin/produtos'
                        })
                } else {
                    this.form.post('/admin/produtos')
                        .then(({data}) => {
                            window.location.href = '/admin/produtos'
                        })
                }

            },
        }
    }
</script>
