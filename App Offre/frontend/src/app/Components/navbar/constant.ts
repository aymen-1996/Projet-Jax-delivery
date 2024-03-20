export const Constant={
    ApiEndPoints:{

    },
    Patterns:{

    },
    menus:[
        {
            path:'Accueil',
            text:'Accueil',
            roles:['admin','user']
        },
        {
            path:'creatOffre',
            text:'Ajouter une offre',
            roles:['admin','user']
        },
        {
            path:'All',
            text:'Consulter vos offres non validé',
            roles:['user']
        },{
            path:'OffreValide',
            text:'Consulter vos offres validé',
            roles:['user']
        }
        ,
        {
            path:'adminListOffre',
            text:'Consulter Tous les offres',
            roles:['admin']
        },

        {
            path:'listUser',
            text:'Liste utilisateurs',
            roles:['admin']
        }
    ]
    
}