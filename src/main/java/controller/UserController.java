package controller;

import java.io.Serializable;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

import ws.MessageEndPoint;
import model.User;

@ManagedBean(name="userController")
@ViewScoped
public class UserController implements Serializable{

	private static final long serialVersionUID = -3770573459254222700L;
	
	private User user;
	
	private List<User> users;
	
	private String message;
	
	private String sessionID;

	public UserController() {
		System.out.println("*** Construtor!!");
		this.user = new User();
		this.users = new ArrayList<User>();
		this.message = null;
		this.sessionID = null;
	}
	
	public String addUser(){

		Format formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm");
		String dateStr = formatter.format(new Date());
		this.user.setDateOfLogin(dateStr);
		this.user.setId(this.users.size()+1);
		this.users.add(this.user);
				
		// Capturando o id da sessao
		int numbOfSessions = MessageEndPoint.getSessions().size();
		if (numbOfSessions > 0){
			this.sessionID = MessageEndPoint.getSessions().get(numbOfSessions-1).getId();
		}else{
			this.sessionID = "0";
		}
		
		this.user = new User();
		return null;
	}
	
	public String sendMessage(){
		return null;
		
	}
	
	// GET AND SET
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getSessionID() {
		return sessionID;
	}

	public void setSessionID(String sessionID) {
		this.sessionID = sessionID;
	}

}
