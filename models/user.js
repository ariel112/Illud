
module.exports = function(sequelize, Sequelize) {

//campos para guardar en la base de datos
	var User = sequelize.define('tbl_usuario', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
		firstname: { type: Sequelize.STRING,notEmpty: true},
		lastname: { type: Sequelize.STRING,notEmpty: true},
		username: {type:Sequelize.TEXT},
		about : {type:Sequelize.TEXT},
		email: { type:Sequelize.STRING, validate: {isEmail:true} },
		password : {type: Sequelize.STRING,allowNull: false }, 
		last_login: {type: Sequelize.DATE},
		provider: {type:Sequelize.STRING,notEmpty: true},
		provider_id: {type:Sequelize.STRING, unique:true},
		photo: {type:Sequelize.STRING},
        status: {type: Sequelize.ENUM('active','inactive'),defaultValue:'active' }

});

	return User;

}