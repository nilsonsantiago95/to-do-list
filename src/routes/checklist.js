const express = require('express')

const Checklist = require('../models/checklist')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let checklists = await Checklist.find({})
        res.status(200).render('checklists/index', { checklists: checklists })
    } catch(error) {
        res.status(200).render('pages/error', {error: 'Erro ao exibir as listas'})
    }
})

router.get('/new', async (req, res) => {
    try {
        let checklist = new Checklist()
        res.status(200).render('checklists/new', { checklist: checklist })
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao carregar o formulário' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks')
        res.status(200).render('checklists/show', { checklist: checklist })
    } catch(error) {
        res.status(200).render('pages/error', {error: 'Erro ao exibir as listas de tarefas'})
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const checklist = await Checklist.findById(req.params.id)
        res.status(200).render('checklists/edit', {checklist: checklist})
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao exibir a edição de listas de tarefas'})
    }
})

router.post('/', async (req, res) => {
    let { name } = req.body.checklist
    let checklist = new Checklist({name})

    try {
        await checklist.save()
        res.redirect('/checklists')
    } catch (error) {
        res.status(422).render('checklists/new', {checklists: {...checklist, error}})
    }
})

router.put('/:id', async (req, res) => {
    let { name } = req.body.checklist
    let checklist = await Checklist.findById(req.params.id)

    try {
        await checklist.update({name})
        res.redirect('/checklists')
    } catch (error) {
        let errors = error.errors
        res.status(422).render('/checklist/edit', {checklist: {...checklist, errors}})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const checklist = await Checklist.findByIdAndDelete(req.params.id)
        res.redirect('/checklists')
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao deletar a listas de tarefas'})
    }
})

module.exports = router