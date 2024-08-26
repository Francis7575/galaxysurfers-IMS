const pool = require('../models/connection')
const bcrypt = require('bcrypt')

// Checks for a specific cookie 
const checkLoggedIn = async (req, res) => {
  if (req.signedCookies.userId) {
    // Fetch user info based on userId
    try {
      const result = await pool.query('SELECT username FROM users WHERE iduser = $1', [req.signedCookies.userId]);
      const user = result.rows[0];
      res.status(200).json({
        loggedIn: true,
        userId: req.signedCookies.userId,
        username: user ? user.username : ''
      });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ loggedIn: false });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body; 
  console.log('Request body:', req.body);

  try {
    const result = await pool.query(`SELECT * FROM users WHERE username = $1 AND status_user = 1`, [username]);

    if (result.rows.length > 0) {
      // Extract user data
      const user = result.rows[0];
      const hashedPassword = user.pass_user;
      const isMatch = await bcrypt.compare(password, hashedPassword); 

      if (isMatch) {
        const userId = user.iduser;

        res.cookie('userId', userId, {
          httpOnly: true,
          maxAge: 60000 * 10, // expires in 10 min
          signed: true,
          sameSite: 'Strict',
        });

        res.status(200).json({
          userId,
          loggedIn: true
        });
      } else {
        // Password incorrect
        res.status(401).json({
          message: 'Password incorrect!'
        });
      }
    } else {
      // User does not exist
      res.status(404).json({
        message: 'User does not exist'
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

// get menus with access
const getMenuAccess = async (req, res) => {
  try {
      /*
      3 types of response
      
      when userId is null returns all existing menus
      when userId is not null and responseType = 'all' returns all existing menus access or not
      when userId is not null and responseType = 'allowed' returns just the menus with access
      */
      let { userId, responseType } = req.query;

      let ex = '';
      if(!userId){
          userId = 0;
      }else{
          if(responseType == 'allowed'){
              ex = `and access_mmu2 = 1`;
          }
      }
      
      const result = await pool.query(`select 
          idmm2, idmm, name_mm, link_mm, order_mm, fa_mm, type_mm,
          idmm_mm2, name_mm2, link_mm2, order_mm2,
          coalesce(access_mmu2, 0) as access_menu

          from navbar_menu2
          left join navbar_menu on navbar_menu2.idmm_mm2 = navbar_menu.idmm 
          left join (select idmm_mmu2, access_mmu2 from navbar_menu_user where iduser_mmu2 = ${userId} ) UA on navbar_menu2.idmm2 = UA.idmm_mmu2

          where navbar_menu2.status_mm2 = 1  ${ex}
          group by idmm2, idmm, access_menu
          order by order_mm, order_mm2
      `); 

      const datarows = [];
      const menuMap = [];

      result.rows.forEach(row => {
          if (!menuMap[row.idmm]) {
              menuMap[row.idmm] = { idmm: row.idmm, name_mm: row.name_mm, link_mm: row.link_mm, order_mm: row.order_mm, fa_mm: row.fa_mm, type_mm: row.type_mm, subMenus: [] };
              datarows.push(menuMap[row.idmm]);
          }
          menuMap[row.idmm].subMenus.push({ idmm2: row.idmm2, idmm_mm2: row.idmm_mm2, name_mm2: row.name_mm2, link_mm2: row.link_mm2, order_mm2: row.order_mm2, access_menu: row.access_menu });
      });
      
      res.status(200).json(datarows)
  } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
  }
}

//logout
const logout = (req, res) => {
  res.clearCookie('userId') 
  res.json({
      userId: '',
      loggedIn: false
  })
}

module.exports = {
  login,
  checkLoggedIn,
  getMenuAccess,
  logout
}